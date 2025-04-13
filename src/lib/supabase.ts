import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// Use environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

<<<<<<< HEAD
// Initialize database connection
const initializeDatabase = async () => {
  try {
    // Check if tables exist and create them if needed
    const { data: tablesExist, error: checkError } = await supabase
      .from("admins")
      .select("id")
      .limit(1);

    if (checkError && checkError.code === "42P01") {
      console.log(
        "Tables do not exist yet. They will be created by migrations.",
      );
    } else {
      console.log("Database tables already exist.");
    }

    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
};

=======
>>>>>>> 88aa6c009c924915bc547b81baa3eba92061fd2e
console.log("Supabase URL:", supabaseUrl);
console.log(
  "Supabase Anon Key:",
  supabaseAnonKey ? supabaseAnonKey.substring(0, 10) + "..." : "not set",
);

// Check if Supabase credentials are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase credentials are not set. Please check your environment variables.",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

<<<<<<< HEAD
// Call initialization function
initializeDatabase();

=======
>>>>>>> 88aa6c009c924915bc547b81baa3eba92061fd2e
// Helper functions for common Supabase operations

// Authentication helpers
export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};

// Generic data helpers
export const fetchData = async <T>(table: string, query?: any) => {
  let queryBuilder = supabase.from(table).select("*");

  if (query) {
    // Apply filters, ordering, etc. from query object
    if (query.filters) {
      for (const filter of query.filters) {
        queryBuilder = queryBuilder.filter(
          filter.column,
          filter.operator,
          filter.value,
        );
      }
    }

    if (query.orderBy) {
      queryBuilder = queryBuilder.order(query.orderBy.column, {
        ascending: query.orderBy.ascending,
      });
    }

    if (query.limit) {
      queryBuilder = queryBuilder.limit(query.limit);
    }
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error(`Error fetching data from ${table}:`, error);
    throw error;
  }

  return data as T[];
};

export const insertData = async <T>(table: string, data: Partial<T>) => {
  const { data: insertedData, error } = await supabase
    .from(table)
    .insert(data)
    .select();

  if (error) {
    console.error(`Error inserting data into ${table}:`, error);
    throw error;
  }

  return insertedData as T[];
};

export const updateData = async <T>(
  table: string,
  id: string,
  data: Partial<T>,
) => {
  const { data: updatedData, error } = await supabase
    .from(table)
    .update(data)
    .eq("id", id)
    .select();

  if (error) {
    console.error(`Error updating data in ${table}:`, error);
    throw error;
  }

  return updatedData as T[];
};

export const deleteData = async (table: string, id: string) => {
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    console.error(`Error deleting data from ${table}:`, error);
    throw error;
  }

  return true;
};
