from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import numpy as np

# 🔹 Configuração do Flask
app = Flask(__name__, static_folder=os.path.abspath("frontend"), static_url_path="/")
CORS(app)

# 🔹 Rota para servir a página inicial (corrigida)
@app.route("/")
def index():
    return send_from_directory("frontend", "index.html")

# 🔹 Rota para servir arquivos estáticos (JS, CSS, etc.)
@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory("frontend", filename)

# 🔹 Algoritmo corrigido para distribuição dos pães de queijo
def packing_algorithm(width_form, height_form, num_paos, pao_width, pao_height):
    """ Algoritmo de empacotamento para distribuir pães de queijo na forma """
    grid = np.zeros((height_form, width_form))
    placements = []
    count = 0

    # Percorre toda a grade e tenta posicionar os pães de queijo sem sobreposição
    for y in range(0, height_form, pao_height):
        for x in range(0, width_form, pao_width):
            if count >= num_paos:
                break
            if np.sum(grid[y:y+pao_height, x:x+pao_width]) == 0:  # Verifica espaço livre
                grid[y:y+pao_height, x:x+pao_width] = 1  # Marca como ocupado
                placements.append((x, y))
                count += 1

    return {
        "num_paos_colocados": len(placements),
        "total_paos": num_paos,
        "distribuicao": placements
    }

# 🔹 Rota para resolver o problema
@app.route("/solve", methods=["POST"])
def solve():
    try:
        data = request.json
        width_form = data.get("width_form")
        height_form = data.get("height_form")
        num_paos = data.get("num_paos")
        pao_width = data.get("pao_width")
        pao_height = data.get("pao_height")

        # 🔹 Correção: Verificar explicitamente se há valores nulos
        if None in [width_form, height_form, num_paos, pao_width, pao_height]:
            return jsonify({"error": "Parâmetros inválidos! Todos os campos são obrigatórios."}), 400

        # 🔹 Executar o algoritmo de empacotamento
        result = packing_algorithm(width_form, height_form, num_paos, pao_width, pao_height)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": "Erro ao processar a requisição", "details": str(e)}), 500

# 🔹 Rota de teste para verificar se o servidor está rodando
@app.route("/ping")
def ping():
    return "Servidor Flask rodando corretamente!"

# 🔹 Rodando o Flask na porta 5000 (outra opção: 5001)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
