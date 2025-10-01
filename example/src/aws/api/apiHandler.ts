interface LambdaResult {
  statusCode: number;
  body: string;
}

export async function invokeLambdaWithQuery(
  method: string,
  queryString: string
): Promise<LambdaResult> {
  try {
    const baseURL =
      "https://77gfxz605m.execute-api.ap-northeast-3.amazonaws.com/dev";
    const resource = "/rdsProxyPostgres";
    const url = baseURL + resource;

    const response = await fetch(url, {
      method: method,
      body: JSON.stringify({
        queryString,
      }),
    });

    const responseBody = await response.json();

    return {
      statusCode: responseBody.statusCode,
      body: responseBody.body,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "内部サーバーエラー",
        error: error.toString(),
      }),
    };
  }
}
