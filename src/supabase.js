/**
 * Supabase REST Client for Cloudflare Workers
 * Zero dependencies - uses native fetch
 * Works with Supabase PostgREST API v1
 */

export function createClient(url, serviceKey) {
  const restUrl = `${url}/rest/v1`;

  const baseHeaders = {
    'apikey': serviceKey,
    'Authorization': `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  };

  // Convert filter object to PostgREST query string
  function buildFilter(filter) {
    if (!filter || typeof filter !== 'object') return '';
    return Object.entries(filter)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => {
        if (typeof v === 'object' && v.op) return `${k}=${v.op}.${encodeURIComponent(v.val)}`;
        return `${k}=eq.${encodeURIComponent(v)}`;
      })
      .join('&');
  }

  return {
    /**
     * SELECT rows from a table
     * @param {string} table - Table name
     * @param {string} columns - Columns to select (default '*')
     * @param {object} opts - Options: { filter, order, limit, offset, single, head }
     * @returns {Promise<Array|Object|null>}
     */
    async select(table, columns = '*', opts = {}) {
      let url = `${restUrl}/${table}?select=${encodeURIComponent(columns)}`;
      const params = [];
      if (opts.filter) params.push(buildFilter(opts.filter));
      if (opts.order) params.push(`order=${opts.order}`);
      if (opts.limit) params.push(`limit=${opts.limit}`);
      if (opts.offset) params.push(`offset=${opts.offset}`);
      if (params.length) url += '&' + params.join('&');

      const headers = { ...baseHeaders };
      if (opts.single) url += '&limit=1';
      if (opts.head) headers['Prefer'] = 'count=exact';

      const res = await fetch(url, { headers });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Supabase SELECT ${res.status} on ${table}: ${err}`);
      }
      if (opts.head) {
        const range = res.headers.get('content-range');
        if (range) {
          const total = range.split('/')[1];
          return total === '*' ? 0 : parseInt(total, 10);
        }
        return 0;
      }
      const data = await res.json();
      return opts.single ? (data[0] || null) : data;
    },

    /**
     * INSERT one or more rows
     * @param {string} table - Table name
     * @param {object|Array} row - Row data or array of rows
     * @returns {Promise<Object|Array>}
     */
    async insert(table, row) {
      const res = await fetch(`${restUrl}/${table}`, {
        method: 'POST',
        headers: { ...baseHeaders, 'Prefer': 'return=representation' },
        body: JSON.stringify(row),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Supabase INSERT ${res.status} on ${table}: ${err}`);
      }
      const data = await res.json();
      return Array.isArray(row) ? data : (data[0] || null);
    },

    /**
     * UPDATE rows matching filter
     * @param {string} table - Table name
     * @param {object} changes - Fields to update
     * @param {object} filter - Filter conditions
     * @returns {Promise<Array>}
     */
    async update(table, changes, filter) {
      const filterStr = buildFilter(filter);
      const res = await fetch(`${restUrl}/${table}?${filterStr}`, {
        method: 'PATCH',
        headers: { ...baseHeaders, 'Prefer': 'return=representation' },
        body: JSON.stringify(changes),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Supabase UPDATE ${res.status} on ${table}: ${err}`);
      }
      return await res.json();
    },

    /**
     * DELETE rows matching filter
     * @param {string} table - Table name
     * @param {object} filter - Filter conditions
     * @returns {Promise<Array>}
     */
    async remove(table, filter) {
      const filterStr = buildFilter(filter);
      const res = await fetch(`${restUrl}/${table}?${filterStr}`, {
        method: 'DELETE',
        headers: baseHeaders,
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Supabase DELETE ${res.status} on ${table}: ${err}`);
      }
      return await res.json();
    },

    /**
     * Count rows matching filter (uses Content-Range header)
     * @param {string} table - Table name
     * @param {object} [filter] - Filter conditions
     * @returns {Promise<number>}
     */
    async count(table, filter) {
      let url = `${restUrl}/${table}?select=id`;
      if (filter) url += `&${buildFilter(filter)}`;
      const res = await fetch(url, {
        headers: { ...baseHeaders, 'Prefer': 'count=exact', 'Range': '0-0' },
      });
      const range = res.headers.get('content-range');
      if (range) {
        const total = range.split('/')[1];
        return total === '*' ? 0 : parseInt(total, 10);
      }
      return 0;
    },

    /**
     * Execute a raw RPC call
     * @param {string} fn - Function name
     * @param {object} params - Parameters
     * @returns {Promise<any>}
     */
    async rpc(fn, params = {}) {
      const res = await fetch(`${restUrl}/rpc/${fn}`, {
        method: 'POST',
        headers: baseHeaders,
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Supabase RPC ${res.status} on ${fn}: ${err}`);
      }
      return await res.json();
    },
  };
}
