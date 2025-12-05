import os
import difflib
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq

app = FastAPI()
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MensagemUsuario(BaseModel):
    texto: str
    modo: str

CARDAPIO_TEXTO = """
🍕 *PIZZAS TRADICIONAIS*
1. Calabresa (R$ 45,00)
2. Mussarela (R$ 40,00)
3. Frango c/ Catupiry (R$ 50,00)

🥤 *BEBIDAS*
4. Coca-Cola 2L (R$ 12,00)
"""

# --- Bot Básico ---
def bot_basico(texto):
    t = texto.lower()
    if "cardápio" in t or "cardapio" in t:
        return f"[BÁSICO] Aqui está:\n{CARDAPIO_TEXTO}"
    elif "promoção" in t or "promocao" in t:
        return "[BÁSICO] 2 Pizzas por R$ 70,00."
    return "[BÁSICO] Comando não reconhecido. Tente 'cardápio'."

# --- Bot Smart ---
def bot_smart(texto):
    texto_lower = texto.lower()
    palavras_usuario = texto_lower.split()
    
    conhecimentos = {
        "cardápio": ["cardapio", "menu", "lista", "opções", "opcoes", "ver", "comer", "fome"],
        "promoção": ["promocao", "oferta", "desconto", "barato"],
        "olá": ["oi", "opa", "bom", "ola", "eai"]
    }

    intencao = None
    for key, values in conhecimentos.items():
        if difflib.get_close_matches(key, palavras_usuario, n=1, cutoff=0.6):
            intencao = key; break
        for val in values:
            if difflib.get_close_matches(val, palavras_usuario, n=1, cutoff=0.6):
                intencao = key; break
        if intencao: break

    if intencao == "cardápio": return f"[SMART] Entendi que você quer comer:\n{CARDAPIO_TEXTO}"
    if intencao == "promoção": return "[SMART] Oferta do dia: Entrega grátis acima de R$ 100!"
    if intencao == "olá": return "[SMART] Olá! Posso te mostrar o cardápio?"
    
    return f"[SMART] Não entendi '{texto}' exato, mas tentei corrigir. Quis dizer 'cardápio'?"

# --- Bot Premium (IA) ---
def bot_premium(texto):
    system_prompt = f"""
    Você é o 'Robô-Garçom' da Pizzaria Tech.
    Seu tom é: Divertido, Vendedor e Educado. Use Emojis! 🍕😋
    
    CARDÁPIO ATUAL:
    {CARDAPIO_TEXTO}
    
    REGRAS:
    1. Se perguntarem ingredientes, invente descrições deliciosas (queijo derretendo, borda crocante).
    2. Se o cliente falar de outra coisa (futebol, política), brinque e volte para pizza.
    3. Seu objetivo final é fazer o cliente pedir.
    """
    
    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": texto}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=200,
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Erro na Groq: {e}")
        return "⚠️ Erro de conexão com a IA Premium. Verifique sua chave API."

@app.post("/api/chat")
async def chat(msg: MensagemUsuario):
    if msg.modo == "premium":
        resposta = bot_premium(msg.texto)
    elif msg.modo == "smart":
        resposta = bot_smart(msg.texto)
    else:
        resposta = bot_basico(msg.texto)
        
    return {"resposta": resposta}