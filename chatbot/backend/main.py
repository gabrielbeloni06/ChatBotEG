import os
import difflib
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq

app = FastAPI()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# --- CORS (LIBERADO) ---
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

CARDAPIO = """
🍔 *ZYTECH BURGERS - 2077*
1. Cyber Burger (R$ 35,00) - Carne sintética premium, queijo neon.
2. Netrunner (R$ 42,00) - Duplo smash, bacon crocante.
3. Edgerunner Combo (R$ 55,00) - Burger + Batata + Refri.
"""

def bot_bronze(texto):
    t = texto.lower()
    if "cardápio" in t or "cardapio" in t or "menu" in t:
        return f"[SYSTEM: BRONZE_MODE]\n{CARDAPIO}\n\nDigite o número do pedido."
    elif "1" in t or "2" in t or "3" in t:
        return "[SYSTEM: BRONZE_MODE] Item adicionado. Digite 'fechar' para concluir."
    elif "fechar" in t:
        return "[SYSTEM: BRONZE_MODE] Pedido enviado. Aguarde o motoboy."
    return "[SYSTEM: ERROR] Comando inválido. Digite 'cardápio'."

def bot_turbo(texto):
    system_prompt = f"""
    Você é o sistema de IA da 'Zytech Foods' em Night City.
    Personalidade: Cyberpunk, rápido, usa gírias como 'Choom', 'Nova', 'Eddie'.
    
    CARDÁPIO:
    {CARDAPIO}
    
    SUA MISSÃO (NÃO PARE ATÉ COMPLETAR):
    1. Tirar o pedido do cliente.
    2. Pegar o ENDEREÇO de entrega.
    3. Pegar a FORMA DE PAGAMENTO.
    
    Se o cliente desviar do assunto, corte e volte para o pedido. Você precisa fechar a venda.
    """
    
    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": texto}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=250,
        )
        return completion.choices[0].message.content
    except Exception as e:
        return "⚠️ [CONNECTION_LOST] Erro na Neural Link (API). Tente novamente."

@app.post("/api/chat")
async def chat(msg: MensagemUsuario):
    if msg.modo == "turbo":
        resposta = bot_turbo(msg.texto)
    else:
        resposta = bot_bronze(msg.texto)
    return {"resposta": resposta}