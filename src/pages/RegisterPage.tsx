import { useState } from "react"
import { useNavigate } from "react-router";
import { authRegister } from "@/api/authRegister";
import { Link } from "react-router";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setpasswordRepeat] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleRegister(e: React.SyntheticEvent<HTMLFormElement>){
        e.preventDefault()
        setLoading(true)
        if(password != passwordRepeat){
            toast.error("Passwords do not match", {position: "top-center"})
            setLoading(false)
            return
        }
        if(password.length < 2 || username.length < 2){
            toast.error("Password or username are too short", {position: "top-center"})
            setLoading(false)
            return
        }
        try{
            await authRegister(username, password)
            navigate("/login")
        } catch(error){
            toast.error("Register failed | Username might be taken", {position: "top-center"})
        } finally{
            setLoading(false)
        }
    }


    return (
    <>
    <Card >
        <CardHeader>
            <CardTitle>Create account</CardTitle>
            <CardAction>
                <Button asChild variant="link">
                    <Link className="pt-0" to={'/login'}>Log in</Link>
                </Button>
            </CardAction>
        </CardHeader>
        <form onSubmit={handleRegister}>
            <CardContent>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="username"
                            placeholder="John Pork"
                            required
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <Input 
                            id="password" 
                            type="password" 
                            required
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="passwordRepeat">Reapeat your password</Label>
                        </div>
                        <Input 
                            id="passwordRepeat" 
                            type="password" 
                            required
                            value={passwordRepeat} 
                            onChange={(e) => setpasswordRepeat(e.target.value)}
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-6">
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Loading..." : "Register"}
                </Button>
            </CardFooter>
        </form>
    </Card>
    </>
    )
}

export default RegisterPage