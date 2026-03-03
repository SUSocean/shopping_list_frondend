import { useState, useEffect } from "react"
import { checkAuth } from "../api/authCheck"
import { authLogout } from "../api/authLogout"
import {userDeleteList} from "../api/userDeleteList"
import { Link, useNavigate } from "react-router"
import { getMe } from "../api/getMe"
import type { UserDto } from "@/types/user.types"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardAction
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { userCreateList } from "@/api/userCreateList";
import type { SimpleList } from "@/types/list.types";
import { Field, FieldGroup } from "@/components/ui/field"
import {
  TrashIcon,
  UserRoundIcon
} from "lucide-react"

function HomePage() {

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<UserDto>()
  const [listNamePopUp, setListNamePopUp] = useState("")
  const navigate = useNavigate()

  async function loadUser(){
    const foundUser = await getMe()
    setUser(foundUser)
    console.log(foundUser)
  }

  useEffect(()=>{
    async function init() {
      try{
        const auth = await checkAuth()

        if(!auth){
          navigate("/login")
          return
        }

        loadUser()
        setLoading(false)
      } catch(err){
        console.log(err)
        navigate("/login")
      }
    }

    init()
  }, [])

  function generageLists(){
    if(user){
      if(user.lists.length < 1){
        return(
          <>
          <p></p>
          <p className="text-muted-foreground text-xl text-center">No lists yet. Create a list</p>
          </>
        )
      }else{
      return user.lists.map((list : SimpleList) =>
        <Link to={"/list/" + list.id} key={list.id}>
        <div>
          <Card>
            <CardContent>{list.name}</CardContent>
            <CardAction className="self-end">
              <Button onClick={e => handleDeleteList(e, list.id)} variant="ghost">
                <TrashIcon/>
              </Button>
            </CardAction>
          </Card>
        </div>
        </Link>)
      }
      
    }else{
      return(
        <>
        <div></div>
        <div className="flex justify-center"><Spinner/></div>
        </>
      )
    }
  }

  async function handleCreateList(e: React.SyntheticEvent<HTMLFormElement>, name: string){
    e.preventDefault()
    try{
        await userCreateList(name)
        await loadUser()
      } catch(error){
          console.log(error)
          toast.error("List creation faild", {position: "top-center"})
      }
  }

  async function handleDeleteList(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string){
    e.preventDefault()
    try{
        await userDeleteList(id)
        await loadUser()
      } catch(error){
          console.log(error)
          toast.error("List deletion faild", {position: "top-center"})
      }
  }

  async function handleLogout(){
    await authLogout();
    navigate("/login")
  }

  return (
    <>
    {loading && <Spinner className="size-8"/>}
    {!loading &&
      <div className="w-full h-screen p-5">
        <div className="mb-8 flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{user?.username}<UserRoundIcon/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">New List</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <form onSubmit={(e) => handleCreateList(e, listNamePopUp)}>
                  <DialogHeader className="mb-5">
                    <DialogTitle>Create new list</DialogTitle>
                    <DialogDescription>
                      Type in the name of a list you want to create.
                    </DialogDescription>
                  </DialogHeader>
                  <FieldGroup>
                    <Field>
                      <Input 
                      id="name-1" 
                      name="name" 
                      placeholder="Sunday Kaufland" 
                      required value={listNamePopUp} 
                      onChange={(e) => setListNamePopUp(e.target.value)}
                      />
                    </Field>
                  </FieldGroup>
                  <DialogFooter className="mt-5">
                    <DialogClose asChild>
                      <Button  type="submit">Create list</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
          </Dialog>
        </div>
        <div  className="w-full grid grid-flow-row-dense sm:grid-cols-3 grid-cols-2 grid-rows-3 gap-4">
          {generageLists()}
        </div>
      </div>
    }
    
    </>
  )
}

export default HomePage