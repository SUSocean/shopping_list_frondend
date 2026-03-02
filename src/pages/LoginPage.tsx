import { useState } from "react"
import { useNavigate } from "react-router";
import { authLogin } from "../api/authLogin";
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


function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>){
        e.preventDefault()
        setLoading(true)
        try{
            await authLogin(username, password)
            navigate("/")
        } catch{
            toast.error("Login failed", {position: "top-center"})
        } finally{
            setLoading(false)
        }
        }
  return (
    <>
    <Card >
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardAction>
            <Button asChild variant="link">
                <Link className="pt-0" to={'/register'}>register</Link>
            </Button>
        </CardAction>
      </CardHeader>
      
        <form onSubmit={handleSubmit}>
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
                </div>
            </CardContent>
                <CardFooter className="pt-6">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Loading..." : "Login"}
                    </Button>
            </CardFooter>
      </form>
    </Card>
    </>
  )
}

export default LoginPage