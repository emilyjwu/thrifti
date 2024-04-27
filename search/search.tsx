const search_base_url = "https://lgastaldi-2003-kreubhtdsa-uc.a.run.app/";
//const search_base_url = "http://143.215.118.252:8000/";

export const searchKListings = async (search_string: string, k: number) => {
  try {
    const response = await fetch(
      search_base_url + "search?search_string=" + search_string + "&k=" + k,
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
      console.log("source");
      console.log(data.matches);
      return data.matches;
    }
  } catch (error) {
    console.error("Issue searching for posts: " + error);
    return {};
  }
};

export const upsertListingPC = async (tagArray, listing_id, date) => {
  // turning tag list to string
  const listing_labels = tagArray
    .map((entry) => {
      return entry.description;
    })
    .join(" ");
  console.log(listing_labels);
  const upsert = await fetch(
    search_base_url +
      "upsert?listing_labels=" +
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
      //console.log(response);
      return response;
    })
    .then((data) => {
      //console.log(data);
      return data;
    })
    .catch((error) => {
      console.log("Issue Upserting: " + error);
      return {};
    });
  return upsert;
};

// Re-vectorize whole database
/*
import { firestore } from "../database";
import {
  getDocs,
  collection,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
export const addExistingToPC = async () => {
  const snapshot = await getDocs(collection(firestore, "items"));
  const idsAndTags = snapshot.docs.map((doc) => {
    const tagsData = doc.data().tags || []; // Ensure tagsData is an array, even if 'tags' is undefined
    const id = doc.id;
    return { id, tagsData };
  });
  for (let i = 0; i < idsAndTags.length; i++) {
    const l = idsAndTags[i];
    console.log(await upsertListingPC(l.tagsData, l.id, "20240426"));
  }
};
*/
