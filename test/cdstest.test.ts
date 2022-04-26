import { setupTest } from "../src/utils";



describe("CDS setupTest Suite", () => {

  const axios = setupTest(__dirname, "./app");

  it("should support get odata metadata", async () => {
    const response = await axios.get("/index/$metadata");
    expect(response.status).toBe(200);
    expect(response.data).toMatch(/People/);
  });

  it("should not throw error when data not existed", async () => {
    const response = await axios.get("/index/People(220247c7-4b29-4c2c-b28f-2321fc57ba7e)");
    expect(response.status).toBe(404);
  });

});
