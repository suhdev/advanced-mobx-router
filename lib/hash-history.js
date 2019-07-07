"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HashHistory {
    getDefaultValue() {
        return location.hash.replace('#/', '');
    }
    listen(fn) {
        const callback = () => fn(location.hash.replace('#/', '/'));
        window.addEventListener('hashchange', callback);
        return () => {
            window.removeEventListener('hashchange', callback);
        };
    }
}
exports.HashHistory = HashHistory;
