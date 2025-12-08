import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq

app = FastAPI()

api_key = os.environ.get("GROQ_API_KEY")
client = Groq(api_key=api_key)

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
🍔 *ZYTECH BURGERS*
1. *X-Salada* (R$ 20,00) - Pão, carne, queijo, alface, tomate.
2. *X-Bacon* (R$ 25,00) - Pão, carne, queijo, bacon crocante.
3. *X-Tudo* (R$ 30,00) - Pão, carne, bacon, ovo, salada.
4. *Coca-Cola Lata* (R$ 6,00).
"""

def bot_bronze(texto):
    t = texto.lower()
    
    palavras_endereco = ["rua", "avenida", "av.", "bairro", "apto", "casa", "bloco", "alameda", "travessa"]
    if any(x in t for x in palavras_endereco):
        return (
            "[BRONZE] Perfeito! Recebi seu endereço. 🛵\n\n"
            "O pedido foi confirmado e já está sendo preparado na cozinha!\n"
            "Tempo estimado de entrega: 30 a 40 minutos.\n"
            "Obrigado por pedir na Zytech Burgers!"
        )

    elif any(x in t for x in ["1", "2", "3", "4", "x-salada", "x-bacon", "x-tudo"]):
        return (
            "[BRONZE] Ótima escolha! Já anotei aqui. 📝\n\n"
            "Para finalizar, digite agora seu **ENDEREÇO COMPLETO** (Ex: Rua das Flores, 123)."
        )
    
    # 3. SAUDAÇÃO / MENU (Padrão)
    else:
        return f"[BRONZE] Olá! Bateu a fome? 😋\nConfira nosso cardápio:\n{CARDAPIO}\n\n👉 Digite apenas o NÚMERO do lanche para pedir."

def bot_turbo(texto):
    system_prompt = f"""
    Você é o atendente virtual da 'Zytech Burgers'.
    
    CARDÁPIO:
    {CARDAPIO}
    
    INSTRUÇÕES CRÍTICAS PARA FECHAMENTO:
    1. O cliente escolheu o lanche? -> Peça o endereço imediatamente.
    2. O cliente mandou o endereço? -> PARE DE PERGUNTAR.
    3. QUANDO O CLIENTE MANDAR O ENDEREÇO:
       - Confirme o lanche escolhido.
       - Confirme o endereço de entrega.
       - Diga a frase exata: "Seu pedido está sendo preparado e sairá para entrega em breve!"
       - Não faça mais perguntas. Encerre o atendimento com educação.
    
    Seja curto e objetivo. Não enrole.
    """
    
    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": texto}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3, # Baixa temperatura para ele obedecer regras e não "viajar"
            max_tokens=250,
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Erro Groq: {e}")
        return "⚠️ Erro de conexão. Tente novamente."

@app.post("/api/chat")
async def chat(msg: MensagemUsuario):
    if msg.modo == "turbo":
        resposta = bot_turbo(msg.texto)
    else:
        resposta = bot_bronze(msg.texto)
    return {"resposta": resposta}