import os
import difflib
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq

app = FastAPI()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

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
🍔 *ZYTECH BURGERS - O MELHOR DA CIDADE*
1. *X-Clássico* (R$ 28,00) - Pão brioche, carne 160g, queijo prato e maionese da casa.
2. *X-Bacon Supremo* (R$ 35,00) - Carne 160g, muito bacon, cheddar e cebola caramelizada.
3. *Combo Família* (R$ 60,00) - 2 X-Clássicos + Batata Grande + Refri 2L.
4. *Batata Frita com Cheddar* (R$ 20,00).
"""
def bot_bronze(texto):
    t = texto.lower()
    
    if any(x in t for x in ["oi", "ola", "cardápio", "menu", "fome"]):
        return f"[BRONZE] Olá! Bem-vindo à Zytech Burgers.\nConfira nosso cardápio:\n{CARDAPIO}\n\nDigite o NÚMERO do lanche que você quer."
    
    elif any(x in t for x in ["1", "2", "3", "4"]):
        return "[BRONZE] Ótima escolha! 😋\nAgora, por favor, digite seu ENDEREÇO completo para entrega (Rua e Número)."
    
    elif any(x in t for x in ["rua", "av", "avenida", "bairro", "apto", "casa"]):
        return "[BRONZE] Perfeito! Anotei seu endereço. 🛵\nSeu pedido foi enviado para a cozinha. Tempo estimado: 40 min."
    
    else:
        return "[BRONZE] Não entendi. Digite 'oi' para ver o cardápio ou o número do lanche."

def bot_turbo(texto):
    system_prompt = f"""
    Você é o atendente virtual da 'Zytech Burgers'.
    Seu tom é profissional, simpático e direto (como uma hamburgueria real). Nada de gírias estranhas.
    
    CARDÁPIO:
    {CARDAPIO}
    
    SUAS REGRAS DE OURO:
    1. Se o cliente pedir um lanche, CONFIRME o que ele pediu ("Certo, um X-Bacon...") E peça o endereço logo em seguida.
    2. Se o cliente já mandou o endereço, agradeça e finalize.
    3. Seja breve. O cliente tem fome.
    """
    
    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": texto}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3, # Mais focado, menos criativo
            max_tokens=250,
        )
        return completion.choices[0].message.content
    except Exception as e:
        return "⚠️ Ocorreu um erro no sistema. Por favor, tente novamente."

@app.post("/api/chat")
async def chat(msg: MensagemUsuario):
    if msg.modo == "turbo":
        resposta = bot_turbo(msg.texto)
    else:
        resposta = bot_bronze(msg.texto)
    return {"resposta": resposta}