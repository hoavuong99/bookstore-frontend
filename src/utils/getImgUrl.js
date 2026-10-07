function getImgUrl (name) {
    if (!name) {
        return '';
    }

    if (/^https?:\/\//i.test(name)) {
        return name;
    }

    if (name.startsWith('/uploads')) {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_ORIGIN || '';
        try {
            const parsed = new URL(apiBaseUrl, window.location.origin);
            return `${parsed.origin}${name}`;
        } catch {
            return name;
        }
    }

    return new URL(`../assets/books/${name}`, import.meta.url).toString();
}

export {getImgUrl}