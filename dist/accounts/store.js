// Guests and signed-in learners never share a progress namespace.
window.MCStore = {
  owner: null,
  getItem(key) { try { return localStorage.getItem(this.owner ? `mathcraft-account:${this.owner}:${key}` : key); } catch { return null; } },
  setItem(key, value) { try { localStorage.setItem(this.owner ? `mathcraft-account:${this.owner}:${key}` : key, value); } finally { window.Accounts?.changed(); } },
  removeItem(key) { try { localStorage.removeItem(this.owner ? `mathcraft-account:${this.owner}:${key}` : key); } finally { window.Accounts?.changed(); } }
};
