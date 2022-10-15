import { DbTestSetup } from '../../integration/dbTestSetup';

export function initDbEnv() {
  const dbTestSetup = new DbTestSetup();

  return {
    createConnection: () => dbTestSetup.createConnection(),
    closeConnection: () => dbTestSetup.destroyConnection()
  };
}
