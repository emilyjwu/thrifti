const search_base_url = "http://192.168.64.9:8000/";

export const searchKListings = async (search_string: string, k: number) => {
  try {
    const response = await fetch(
      search_base_url + "search-k?search_string=" + search_string + "&k=" + k,
      {
        method: "GET",
        headers: {},
      }
    );
    if (!response.ok) {
      throw new Error("Failed to Search DB");
    } else {
      const data = await response.json();
      console.log("Search Successful!");
      return data.matches;
    }
  } catch (error) {
    console.error("Issue searching for posts: " + error);
    return {};
  }
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
      return response;
    })
    .then((data) => {
      //console.log(data);
      return data;
    })
    .catch((error) => {
      console.log("Issue searching for posts: " + error);
      return {};
    });
  return upsert;
};
