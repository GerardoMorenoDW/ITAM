import { fetchUtils } from "react-admin";

const apiUrl = "http://localhost:5000";
const httpClient = fetchUtils.fetchJson;

export const provider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const filter = params.filter;

    // Construimos la query string con filtros y paginación
    const query = {
      _sort: field,
      _order: order,
      _start: (page - 1) * perPage,
      _end: page * perPage,
      ...filter,
    };    

    const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;

    const { headers, json } = await httpClient(url);

    return {
      data: json,
      total: json.length || parseInt(headers.get("X-Total-Count"), 10),
    };
  },

  //Métodos
  getOne: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const { json } = await httpClient(url);
  
    return {
      data: {
        ...json,
        id: json.id // adaptá esto según cómo venga tu campo de ID
      },
    };
  },
  //Crear activo
  create: async (resource, params) => {
    const url = `${apiUrl}/api/${resource}`;
    const options = {
      method: "POST",
      body: JSON.stringify(params.data),
    };

    const { json } = await httpClient(url, options);

    return {
      data: { ...params.data, id: json.id }, // asegurate que el backend devuelva el id creado
    };
  },

  update: async (resource, params) => {
    let url = `${apiUrl}/${resource}/${params.id}`;
    const { json } = await httpClient(url, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });
  
    return {
      data: json || params.data, // si tu backend no responde con data, al menos devolvemos la enviada
    };
  },

  deleteMany: async (resource, params) => {
    const url = `${apiUrl}/${resource}/deleteMany`;
    const options = {
      method: 'POST',
      body: JSON.stringify({ ids: params.ids }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    };
  
    const { json } = await httpClient(url, options);
  
    return {
      data: json.deleted || params.ids,
    };
  },
  
  //Listado de activos-fisicos
  getMany: async (resource, params) => {
    const url = `${apiUrl}/${resource}/many`;
  
    const { json } = await httpClient(url, {
      method: 'POST',
      body: JSON.stringify({ ids: params.ids }),
    });
  
    return {
      data: json,
    };
  },
  
  
};
