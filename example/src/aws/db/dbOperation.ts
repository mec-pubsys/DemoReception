import { invokeLambdaWithQuery } from "../api/apiHandler";

export const executeQuery = async (method: string, queryString: string) => {
  try {
    const result = await invokeLambdaWithQuery(method, queryString);
    const parsedBody = JSON.parse(result.body);
    const status = result.statusCode;
    const data = parsedBody.result;

    let message = "";
    if (status === 400) {
      message = "No rows affected by query";
    } else if (status === 200) {
      message = "success";
    } else {
      message = parsedBody.error;
    }
    return { data, message };
  } catch (error) {
    throw new Error("Failed to execute query");
  }
};
