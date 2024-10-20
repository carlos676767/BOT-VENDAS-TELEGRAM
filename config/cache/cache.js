
class DadosCache {
  static cachedDados() {
    const cache = require("node-cache");
    return new cache();
  }
}


module.exports = DadosCache.cachedDados()