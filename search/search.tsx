const search_base_url = "http://192.168.64.9:8000/";

export const searchKListings = async (search_string: string, k: number) => {
  const search_results = await fetch(
    search_base_url + "search-k?search_string=" + search_string + "&k=" + k,
    {
      method: "GET",
      headers: {},
    }
  )
    .then((response) => {
      console.log("Successful Search");
      return response.json();
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.log("Issue searching for posts: " + error);
      return {};
    });
  return search_results;
};

export const upsertListingPC = async (search_array) => {
  const search_results = await fetch(
    search_base_url + "search-k?search_string=" + "&k=",
    {
      method: "GET",
      headers: {},
    }
  )
    .then((response) => {
      console.log("Successful Search");
      return response.json();
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.log("Issue searching for posts: " + error);
      return {};
    });
  return search_results;
};

const tags2String = (tagArray) => {};
