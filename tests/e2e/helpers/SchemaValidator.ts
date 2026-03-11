import { Helper } from "codeceptjs";
import { apiContext } from "../api/context";
import type { ValidateFunction } from "ajv";
import {
  assertValidSchema,
  validateUser,
  validateProject,
  validateTask,
  validateLoginResponse,
  validateDeleteResponse,
} from "./schema-validator";

const validators: Record<string, ValidateFunction> = {
  User: validateUser,
  Project: validateProject,
  Task: validateTask,
  LoginResponse: validateLoginResponse,
  DeleteResponse: validateDeleteResponse,
};

class SchemaValidator extends Helper {
  grabResponse() {
    return apiContext.lastResponse;
  }

  seeResponseMatchesSchema(schemaName: string): void {
    const response = apiContext.lastResponse;
    if (!response) throw new Error("No response captured.");
    const validate = validators[schemaName];
    if (!validate) throw new Error(`Unknown schema: ${schemaName}`);
    assertValidSchema(validate, response.data);
  }

  seeResponseArrayMatchesSchema(schemaName: string): void {
    const response = apiContext.lastResponse;
    if (!response) throw new Error("No response captured.");
    const arr = response.data;
    if (!Array.isArray(arr)) throw new Error("Expected array");
    const validate = validators[schemaName];
    if (!validate) throw new Error(`Unknown schema: ${schemaName}`);
    for (const item of arr) assertValidSchema(validate, item);
  }
}

export = SchemaValidator;
