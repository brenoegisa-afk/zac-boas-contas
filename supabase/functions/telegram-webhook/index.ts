import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Telegram Bot Token
const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');

interface TelegramMessage {
  message_id: number;
  from: {
    id: number;
    username?: string;
    first_name: string;
  };
  chat: {
    id: number;
  };
  text: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

async function sendTelegramMessage(chatId: number, text: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}

function parseTransactionMessage(text: string) {
  // Remove extra spaces and convert to lowercase
  const normalizedText = text.trim().toLowerCase();
  
  // Patterns for different transaction formats
  const patterns = [
    // "gasto 50 almoço" or "receita 1000 salário"
    /^(gasto|receita|despesa|renda)\s+(\d+(?:[.,]\d{2})?)\s+(.+)$/,
    // "50 gasto almoço" or "1000 receita salário"
    /^(\d+(?:[.,]\d{2})?)\s+(gasto|receita|despesa|renda)\s+(.+)$/,
    // "-50 almoço" (negative for expense) or "+1000 salário" (positive for income)
    /^([+-]?)(\d+(?:[.,]\d{2})?)\s+(.+)$/,
  ];

  for (const pattern of patterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      let type: 'income' | 'expense';
      let amount: number;
      let description: string;

      if (match[1] && isNaN(Number(match[1]))) {
        // Pattern 1: "gasto 50 almoço"
        type = ['receita', 'renda'].includes(match[1]) ? 'income' : 'expense';
        amount = parseFloat(match[2].replace(',', '.'));
        description = match[3];
      } else if (match[2] && isNaN(Number(match[1]))) {
        // Pattern 2: "50 gasto almoço"
        amount = parseFloat(match[1].replace(',', '.'));
        type = ['receita', 'renda'].includes(match[2]) ? 'income' : 'expense';
        description = match[3];
      } else {
        // Pattern 3: "-50 almoço" or "+1000 salário"
        const sign = match[1];
        amount = parseFloat(match[2].replace(',', '.'));
        description = match[3];
        
        if (sign === '+') {
          type = 'income';
        } else if (sign === '-') {
          type = 'expense';
        } else {
          // Try to infer from keywords in description
          const incomeKeywords = ['salário', 'salario', 'freelance', 'renda', 'receita'];
          const isIncome = incomeKeywords.some(keyword => description.includes(keyword));
          type = isIncome ? 'income' : 'expense';
        }
      }

      return {
        type,
        amount,
        description: description.charAt(0).toUpperCase() + description.slice(1),
      };
    }
  }

  return null;
}

async function findUserByTelegramId(telegramUserId: number) {
  console.log(`Looking for user with Telegram ID: ${telegramUserId}`);
  
  const { data: integration, error } = await supabase
    .from('telegram_integrations')
    .select('user_id')
    .eq('telegram_user_id', telegramUserId)
    .single();

  if (error) {
    console.log('Error finding user by telegram ID:', error);
    return null;
  }

  return integration ? { user_id: integration.user_id } : null;
}

// Verify Telegram webhook signature for security
function verifyTelegramWebhook(body: string, secretToken: string): boolean {
  // For production, you should verify the webhook signature
  // This is a simplified version - implement proper verification based on your setup
  return true; // Temporarily disabled for development
}

async function getUserDefaultFamily(userId: string) {
  const { data: familyMembers } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', userId)
    .limit(1);

  return familyMembers?.[0]?.family_id || null;
}

async function findCategoryByDescription(description: string, type: 'income' | 'expense', familyId: string) {
  // Try to match category by keywords in description
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('type', type)
    .or(`is_default.eq.true,family_id.eq.${familyId}`);

  if (!categories || categories.length === 0) return null;

  const descLower = description.toLowerCase();
  
  // Simple keyword matching for common categories
  const keywordMap: { [key: string]: string[] } = {
    'alimentação': ['almoço', 'jantar', 'lanche', 'comida', 'restaurante', 'mercado'],
    'transporte': ['uber', 'taxi', 'ônibus', 'gasolina', 'combustivel'],
    'moradia': ['aluguel', 'condominio', 'luz', 'agua', 'internet'],
    'saúde': ['médico', 'remedio', 'farmacia', 'hospital'],
    'lazer': ['cinema', 'bar', 'festa', 'viagem'],
    'salário': ['salario', 'pagamento', 'trabalho'],
  };

  for (const category of categories) {
    const categoryName = category.name.toLowerCase();
    if (keywordMap[categoryName]) {
      if (keywordMap[categoryName].some(keyword => descLower.includes(keyword))) {
        return category;
      }
    }
  }

  // Return first category of the correct type as fallback
  return categories.find(cat => cat.type === type) || categories[0];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    
    // Verify webhook signature for security (optional but recommended)
    const secretToken = req.headers.get('X-Telegram-Bot-Api-Secret-Token');
    if (secretToken && !verifyTelegramWebhook(body, secretToken)) {
      console.log('Invalid webhook signature');
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const update: TelegramUpdate = JSON.parse(body);
    console.log('Received Telegram update:', JSON.stringify(update, null, 2));

    if (!update.message || !update.message.text) {
      return new Response('OK', { headers: corsHeaders });
    }

    const message = update.message;
    const chatId = message.chat.id;
    const telegramUserId = message.from.id;
    const messageText = message.text;

    // Check if this is a command
    if (messageText.startsWith('/')) {
      if (messageText === '/start') {
        await sendTelegramMessage(chatId, 
          `🤖 <b>Olá! Bem-vindo ao Zac - Boas Contas!</b>\n\n` +
          `Para registrar transações, use um dos formatos:\n\n` +
          `💸 <b>Gastos:</b>\n` +
          `• <code>gasto 50 almoço</code>\n` +
          `• <code>despesa 25.50 café</code>\n` +
          `• <code>-30 transporte</code>\n\n` +
          `💰 <b>Receitas:</b>\n` +
          `• <code>receita 1000 salário</code>\n` +
          `• <code>renda 500 freelance</code>\n` +
          `• <code>+200 venda</code>\n\n` +
          `<i>Nota: Para usar este bot, você precisa estar registrado no sistema Zac.</i>`
        );
      } else if (messageText === '/help') {
        await sendTelegramMessage(chatId,
          `ℹ️ <b>Comandos disponíveis:</b>\n\n` +
          `/start - Iniciar o bot\n` +
          `/help - Mostrar esta ajuda\n\n` +
          `<b>Formatos de transação:</b>\n` +
          `• <code>[tipo] [valor] [descrição]</code>\n` +
          `• <code>[valor] [tipo] [descrição]</code>\n` +
          `• <code>[+/-][valor] [descrição]</code>\n\n` +
          `<b>Tipos aceitos:</b> gasto, despesa, receita, renda`
        );
      }
      return new Response('OK', { headers: corsHeaders });
    }

    // Try to find user by Telegram ID
    const userProfile = await findUserByTelegramId(telegramUserId);
    
    if (!userProfile) {
      await sendTelegramMessage(chatId,
        `❌ <b>Usuário não encontrado!</b>\n\n` +
        `Para usar este bot, você precisa:\n` +
        `1. Criar uma conta no sistema Zac\n` +
        `2. Vincular seu Telegram ao perfil\n\n` +
        `<i>Entre em contato com o suporte para mais informações.</i>`
      );
      return new Response('OK', { headers: corsHeaders });
    }

    // Parse transaction from message
    const transaction = parseTransactionMessage(messageText);
    
    if (!transaction) {
      await sendTelegramMessage(chatId,
        `❓ <b>Formato não reconhecido!</b>\n\n` +
        `Use um dos formatos:\n` +
        `• <code>gasto 50 almoço</code>\n` +
        `• <code>receita 1000 salário</code>\n` +
        `• <code>-25.50 café</code>\n` +
        `• <code>+500 freelance</code>\n\n` +
        `Digite /help para mais informações.`
      );
      return new Response('OK', { headers: corsHeaders });
    }

    // Get user's default family
    const familyId = await getUserDefaultFamily(userProfile.user_id);
    
    if (!familyId) {
      await sendTelegramMessage(chatId,
        `❌ <b>Família não encontrada!</b>\n\n` +
        `Você precisa estar em uma família para registrar transações.\n` +
        `Acesse o sistema Zac para criar ou participar de uma família.`
      );
      return new Response('OK', { headers: corsHeaders });
    }

    // Find appropriate category
    const category = await findCategoryByDescription(transaction.description, transaction.type, familyId);

    // Create transaction in database
    const { data: newTransaction, error } = await supabase
      .from('transactions')
      .insert({
        family_id: familyId,
        user_id: userProfile.user_id,
        category_id: category?.id || null,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        notes: `Criado via Telegram por @${message.from.username || message.from.first_name}`,
        transaction_date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      await sendTelegramMessage(chatId,
        `❌ <b>Erro ao registrar transação!</b>\n\n` +
        `Tente novamente ou entre em contato com o suporte.`
      );
      return new Response('OK', { headers: corsHeaders });
    }

    // Send confirmation
    const typeIcon = transaction.type === 'income' ? '💰' : '💸';
    const typeText = transaction.type === 'income' ? 'Receita' : 'Gasto';
    const categoryText = category ? ` (${category.name})` : '';
    
    await sendTelegramMessage(chatId,
      `✅ <b>Transação registrada!</b>\n\n` +
      `${typeIcon} <b>${typeText}:</b> R$ ${transaction.amount.toFixed(2).replace('.', ',')}\n` +
      `📝 <b>Descrição:</b> ${transaction.description}${categoryText}\n` +
      `📅 <b>Data:</b> ${new Date().toLocaleDateString('pt-BR')}\n\n` +
      `<i>Transação #${newTransaction.id.substring(0, 8)}</i>`
    );

    return new Response('OK', { headers: corsHeaders });

  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    return new Response('Internal Server Error', { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});