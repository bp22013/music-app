import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../database/database.types";
import { NextPage } from "next";
import AccountForm from "./account-form";

const Account:NextPage = async () => {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    return <AccountForm session={session} />
}

export default Account;