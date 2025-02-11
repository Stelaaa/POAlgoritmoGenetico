/**
 * Função para resolver o problema de empacotamento dos pães de queijo
 */
async function solvePacking() {
    try {
        console.log("📩 Enviando requisição para o backend...");

        // Captura os valores dos inputs
        const width_form = parseInt(document.getElementById("width").value);
        const height_form = parseInt(document.getElementById("height").value);
        const num_paos = parseInt(document.getElementById("num-paos").value);
        const pao_width = parseInt(document.getElementById("pao-width").value);
        const pao_height = parseInt(document.getElementById("pao-height").value);

        // 🔹 Validação para evitar campos vazios ou inválidos
        if ([width_form, height_form, num_paos, pao_width, pao_height].some(isNaN)) {
            alert("Por favor, preencha todos os campos corretamente.");
            return;
        }

        // 🔹 Desativa o botão para evitar múltiplas requisições
        const button = document.getElementById("solve-button");
        button.disabled = true;
        button.innerText = "Calculando...";

        // 🔹 Define a URL correta da API Flask
        const API_URL = window.location.origin + "/solve";  // Usa a URL correta do servidor

        // 🔹 Envia a requisição ao backend
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                width_form,
                height_form,
                num_paos,
                pao_width,
                pao_height
            })
        });

        if (!response.ok) throw new Error(`Erro na requisição: ${response.statusText}`);

        // 🔹 Converte a resposta para JSON
        const result = await response.json();
        console.log("✅ Resposta recebida do backend:", result);

        // 🔹 Atualiza o resultado na tela
        const resultText = document.getElementById("result-text");
        resultText.innerHTML = `
            <strong>Pães colocados:</strong> ${result.num_paos_colocados} de ${result.total_paos} <br>
            <strong>Distribuição:</strong> <br>
            ${formatDistribution(result.distribuicao)}
        `;

    } catch (error) {
        console.error("🚨 Erro na requisição:", error);
        alert("Erro ao conectar com o servidor.");
    } finally {
        // 🔹 Reativa o botão após a resposta do servidor
        const button = document.getElementById("solve-button");
        button.disabled = false;
        button.innerText = "Calcular Distribuição";
    }
}

/**
 * Função para formatar a distribuição dos pães de queijo
 */
function formatDistribution(distribuicao) {
    if (!distribuicao || distribuicao.length === 0) {
        return "<span class='text-red-500'>Nenhum pão de queijo foi colocado na forma.</span>";
    }

    return `
        <table class="w-full border-collapse border border-gray-400 mt-2">
            <tr>
                <th class="border border-gray-400 p-2">Pão</th>
                <th class="border border-gray-400 p-2">Posição (x, y)</th>
            </tr>
            ${distribuicao.map((pos, i) => `
                <tr>
                    <td class="border border-gray-400 p-2 text-center">${i + 1}</td>
                    <td class="border border-gray-400 p-2 text-center">(${pos[0]}, ${pos[1]})</td>
                </tr>
            `).join("")}
        </table>
    `;
}
