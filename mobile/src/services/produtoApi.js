async function buscarOpenFoodFacts(codigo) {
  try {
    console.log("Buscando código pelo [OpenFoodFacts]: ", codigo);
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${codigo}.json`);
    const dados = await res.json();
    console.log("Usando [OpenFoodFacts]:", dados.status, "nome:", dados.product?.product_name);

    if (dados.status === 1 && dados.product) {
      const p = dados.product;
      console.log("Usando [OpenFoodFacts]: PRODUTO ENCONTRADO");
      return {
        nome: p.product_name || p.product_name_pt || "",
        descricao: p.generic_name || "",
        alertasAlergicos: p.allergens_tags?.map(a => a.replace("en:", "")).join(", ") || "",
        peso: extrairPeso(p.quantity),
        categoria: p.categories_tags?.[0]?.split(":")[1] || "",
      };
    }
    console.log("Usando [OpenFoodFacts]: produto NAO encontrado");
    return null;
  } catch (err) {
    console.log("ERRO USANDO [OpenFoodFacts]:", err.message);
    return null;
  }
}

async function buscarCosmos(codigo) {
  try {
    console.log("[Cosmos] buscando código:", codigo);
    const token = process.env.PUBLIC_COSMOS_TOKEN;

    if (!token) {
      console.log("[Cosmos] Busca cancelada: Token ausente no arquivo .env");
      return null;
    }

    const res = await fetch(`https://api.cosmos.bluesoft.com.br/gtins/${codigo}.json`, {
      headers: { 
        "X-Cosmos-Token": String(token)
      }
    });

    console.log("Status do [Cosmos]:", res.status);

    if (!res.ok) {
      console.log("[Cosmos] produto NAO encontrado ou erro de auth");
      return null;
    }
    const dados = await res.json();
    console.log("[Cosmos] PRODUTO ENCONTRADO:", dados.description);
    return {
      nome: dados.description || "",
      descricao: dados.brand?.name || "",
      alertasAlergicos: "",
      peso: extrairPeso(dados.gpc?.description),
      categoria: dados.ncm?.description || "",
    };
  } catch (err) {
    console.log("[Cosmos] ERRO:", err.message);
    return null;
  }
}

function normalizarCodigo(codigo) {
  let limpo = codigo.trim().replace(/\D/g, "");
  if (limpo.length === 12) {
    limpo = "0" + limpo;
  }
  return limpo;
}

function extrairPeso(texto) {
  if (!texto) return "";
  const match = texto.match(/(\d+(\.\d+)?)\s*(g|kg|ml|l)/i);
  if (!match) return "";
  let valor = parseFloat(match[1]);
  const unidade = match[3].toLowerCase();
  if (unidade === "kg" || unidade === "l") valor *= 1000;
  return String(valor / 1000);
}

export async function buscarProdutoPorCodigoBarras(codigo) {
  const codigoNormalizado = normalizarCodigo(codigo);
  console.log("CODIGO IDENTIFICADO:", codigo, "| NORMALIZADO:", codigoNormalizado);

  const openFood = await buscarOpenFoodFacts(codigoNormalizado);
  if (openFood && openFood.nome) {
    console.log("RESULTADO OPENFOODFACTS: OpenFoodFacts");
    return openFood;
  }

  const cosmos = await buscarCosmos(codigoNormalizado);
  if (cosmos && cosmos.nome) {
    console.log("RESULTADO COSMOS: Cosmos");
    return cosmos;
  }

  console.log("RESULTADO FINAL: NENHUMA API ENCONTROU");
  return null;
}