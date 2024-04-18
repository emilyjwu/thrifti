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

export const upsertListingPC = async (tagArray, listing_id, date) => {
  // turning tag list to string
  const listing_labels = tagArray.map((entry) => entry.description).join(" ");

  const upsert = await fetch(
    search_base_url +
      "upsert-pinecone?listing_labels=" +
      listing_labels +
      "&listing_id=" +
      listing_id +
      "&date=" +
      date,
    {
      method: "POST",
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
  return upsert;
};
