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
    historico: list = [] 

CARDAPIO = """
🍔 *ZYTECH BURGERS*
1. *X-Salada* (R$ 20,00) - Pão, carne, queijo, alface, tomate.
2. *X-Bacon* (R$ 25,00) - Pão, carne, queijo, bacon crocante.
3. *X-Tudo* (R$ 30,00) - Pão, carne, bacon, ovo, salada.
4. *Combo Família* (R$ 60,00) - 2 X-Saladas + Batata + Refri.
"""

def bot_bronze(texto):
    t = texto.lower()
    palavras_endereco = ["rua", "avenida", "av.", "bairro", "apto", "casa", "bloco"]
    
    if any(x in t for x in palavras_endereco):
        return (
            "[BRONZE] Recebi seu endereço! 🛵\n"
            "Seu pedido já foi enviado para a cozinha.\n"
            "Tempo estimado: 30-40 min.\nObrigado!"
        )
    elif any(x in t for x in ["1", "2", "3", "4", "x-salada", "x-bacon", "x-tudo", "combo"]):
        return (
            "[BRONZE] Anotado! 📝\n"
            "Agora digite seu **ENDEREÇO COMPLETO** para entrega."
        )
    else:
        return f"[BRONZE] Olá! Digite o NÚMERO do lanche:\n{CARDAPIO}"

def bot_turbo(texto_atual, historico_frontend):
    system_prompt = f"""
    Você é o atendente da 'Zytech Burgers'.
    CARDÁPIO: {CARDAPIO}
    
    ESTADO ATUAL DO PEDIDO:
    - O cliente já escolheu o lanche no histórico? -> SE SIM, PEÇA O ENDEREÇO.
    - O cliente acabou de mandar o endereço? -> SE SIM, FINALIZE.
    
    REGRAS DE RESPOSTA:
    1. Se recebeu o endereço, diga EXATAMENTE: "Perfeito! Seu pedido [repita o lanche] está sendo preparado e será enviado para [repita o endereço]. Tempo: 40min."
    2. Seja curto.
    """
    
    messages_payload = [{"role": "system", "content": system_prompt}]
    
    for msg in historico_frontend[-4:]:
        role = "assistant" if msg['role'] == "bot" else "user"
        messages_payload.append({"role": role, "content": msg['content']})
        
    # Adiciona a mensagem atual
    messages_payload.append({"role": "user", "content": texto_atual})
    
    try:
        completion = client.chat.completions.create(
            messages=messages_payload,
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            max_tokens=250,
        )
        return completion.choices[0].message.content
    except Exception as e:
        return "⚠️ Erro de conexão neural."

@app.post("/api/chat")
async def chat(msg: MensagemUsuario):
    if msg.modo == "turbo":
        # Passa o texto E o histórico para a IA
        resposta = bot_turbo(msg.texto, msg.historico)
    else:
        resposta = bot_bronze(msg.texto)
    return {"resposta": resposta}