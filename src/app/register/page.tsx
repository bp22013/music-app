import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../database/database.types";
import { NextPage } from "next";
import RegisterForm from "./register-form";

const Register:NextPage = async () => {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    return <RegisterForm session={session} />
}

export default Register;