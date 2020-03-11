import { CosmosDBManagementClient } from "@azure/arm-cosmosdb";
import { ManagedIdentityCredential, AccessToken } from "@azure/identity";
import { TokenCredentials } from "@azure/ms-rest-js";

export default class CosmosManagedIdentity {

    static async connectionStringForResourceId(resourceId: string): Promise<string> {
        //let accessToken = await this.getAccessToken();
        let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSIsImtpZCI6IkhsQzBSMTJza3hOWjFXUXdtak9GXzZ0X3RERSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuYXp1cmUuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3LyIsImlhdCI6MTU4MDQ5NzM4MiwibmJmIjoxNTgwNDk3MzgyLCJleHAiOjE1ODA1MjY0ODIsImFpbyI6IjQyTmdZTmh6WnZIaFFMRXpSMVNLKzVndlN6WS9CQUE9IiwiYXBwaWQiOiI5NTMwNTIyZS0zN2JjLTRkNGItYTE0Ny1kMTRmZWZjYzdhOGUiLCJhcHBpZGFjciI6IjIiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwib2lkIjoiMTcyNjM3ZGEtYWE0ZC00Mjk0LTljNGItYjAyNGYzMjc4ODFmIiwic3ViIjoiMTcyNjM3ZGEtYWE0ZC00Mjk0LTljNGItYjAyNGYzMjc4ODFmIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidXRpIjoidWRmanZyS3hnRVNUZ2Yyd0hWc0VBQSIsInZlciI6IjEuMCIsInhtc19taXJpZCI6Ii9zdWJzY3JpcHRpb25zL2VhYmVmMmI5LTgzNTgtNDYyYy1hMTBhLWYzNjkxZTFjODNhNi9yZXNvdXJjZWdyb3Vwcy9yYWh1bW1lbC1zYW5kYm94L3Byb3ZpZGVycy9NaWNyb3NvZnQuTWFuYWdlZElkZW50aXR5L3VzZXJBc3NpZ25lZElkZW50aXRpZXMvY29zbW9jYXRzLWlkZW50aXR5In0.W7TYs9-xbh8b5Gdg9nMrPJZpXjKwB7sDIz0t79qQIqQutBq8nit3elAjbhLCCGOqiRO0NtkkpeMhlQp-ZH7skueOd7JNLlTUqgoKWaJdBN8ba4j3E0P9QVpXjOf5UIuuxamVzYEWAnAOFfDRV6EE74eK1VjjiuXxiDOgMyOCf9319Ba6KzgDG_1JRvpbEu-W-TdLhCpaMZTO-Wf30IKcy96BIiJOP0srkhBAWdbfAPgl3VXHUtSlIxokxKpei1nKME0fCxU7Hm-F5DAH8dqV4SjYPBf-Gqs-QHfhS6G1tMagu93VTX3rrna7Qw4LYFNCk63edjimRoyZcIXUG0sf7g";
        let tokenCredentials = new TokenCredentials(token);
        let decodeRegEx = new RegExp("\/.*\/([^/]*)\/.*\/([^/]*)\/.*\/.*\/.*\/([^/]*)");
        let decodeResult = decodeRegEx.exec(resourceId);
        let subscriptionId = decodeResult[1];
        let resourceGroupName = decodeResult[2];
        let databaseAccountName = decodeResult[3];
        let managementClient = new CosmosDBManagementClient(tokenCredentials, subscriptionId, subscriptionId);
        let databaseAccount = await managementClient.databaseAccounts.get(resourceGroupName, databaseAccountName);

        return null;
    }

    private static async getAccessToken(): Promise<AccessToken> {
        console.log("Creating ManagedIdentityCredential object..");
        let managedIdentityCredential = new ManagedIdentityCredential();
        console.log("Attempting to get token for scope https://management.azure.com..");
        try {
            let accessToken = await managedIdentityCredential.getToken("https://management.azure.com");
            console.log("Got access token..");
            return accessToken;
        } catch (error) {
            console.log("Did catch: " + error);
        }
    }

}
