
const contentTypeJSON = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-Submitted-By': 'kuasha-test',
};

const contentTypeForm = {
  Accept: 'application/json',
};

const fetchJSON = async (
  url,
  data,
  method = 'GET',
  header,
  form,
) => {
  if (process.env.NODE_ENV === 'development') {
    console.log({
      url,
      header,
    });
  }
  if (header && header['X-Not-Logged-In']) {
    throw new Error('User is not Logged In');
  }
  const res = await fetch(url, {
    method,
    headers: form
      ? { ...contentTypeForm, ...header }
      : { ...contentTypeJSON, ...header },
    body: form || JSON.stringify(data),
  });
  if (!res.headers.get('Content-Type')?.includes('json')) {
    const txt = await res.text();
    console.log({ url, txt });
    throw new Error('Server Returned Non-JSON Data');
  }

  return res.json();
};

const fetchDetailsOk = async (
  url,
  data,
  method = 'GET',
  ok = 200,
  header,
  form,
) => {
  console.log(header);
  try {
    const json = await fetchJSON(url, data, method, header, form);
    console.log(json)
    // if (json.code !== ok) {
    //   throw new Error(json.message);
    // }

    if (json.success === null || json.success === undefined) {
      throw new Error('No Token');
    }

    return json.success;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default fetchDetailsOk;
