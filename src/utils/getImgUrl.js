function getImgUrl (name) {
    if (!name) {
        return '';
    }

    if (/^https?:\/\//i.test(name)) {
        return name;
    }

    if (name.startsWith('/uploads')) {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';
        try {
            const parsed = new URL(apiBaseUrl);
            return `${parsed.origin}${name}`;
        } catch {
            return name;
        }
    }

    return new URL(`../assets/books/${name}`, import.meta.url).toString();
}

export {getImgUrl}