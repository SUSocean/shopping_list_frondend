import { listGet } from "@/api/listGet"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import type { OpenedList } from "@/types/list.types"
import type {SimpleUser} from "@/types/user.types"
import type { ItemDto } from "@/types/item.types"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import axios from "axios";
import { listDeleteItem } from "@/api/lsitDeleteItem"
import { listEditItemName } from "@/api/listEditItemName"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
  ItemGroup
} from "@/components/ui/item"
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
import { Separator } from "@/components/ui/separator"
import { listCreateItem } from "@/api/listCreateItem"
import {
  TrashIcon,
  PlusIcon,
  PencilIcon,
  UserPenIcon
} from "lucide-react"

import { Field, FieldGroup } from "@/components/ui/field"
import { listEditItemActive } from "@/api/listEditItemActive"


function ListPage() {
    const path = window.location.pathname.split("/")[2]

    const [list, setList] = useState<OpenedList>()  
    const [loading, setLoading] = useState(false)
    const [itemName, setItemName] = useState("")
    const [editItemName, setEditItemName] = useState("")
    const navigate = useNavigate()

    async function loadList(){
        const list = await listGet(path)
          setList(list)
          console.log(list)
      }

    useEffect(()=>{
        async function init() {
          setLoading(true)
          try{
          loadList()
          setLoading(false)
        } catch(err){
          console.log(err)
          navigate("/login")
        }
      }
  
      init()
    }, [])

    function generateItems(){
      if(list){
      if(list.items.length < 1){
        return(
          <>
          <p></p>
          <p className="text-muted-foreground text-xl text-center">No items yet</p>
          </>
        )
      }else{
      return list.items.map((item : ItemDto) =>
          <Item className="mb-1" variant={item.active? "outline" : "muted"} key={item.id}>
            <ItemContent>
              <ItemTitle>{item.name}</ItemTitle>
            </ItemContent>
            <ItemActions className="h-full">
              <Button onClick={() => handleItemDeletion(item.id)} size="sm" variant="ghost">
                <TrashIcon/>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost"><PencilIcon/></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                <DialogHeader className="mb-5">
                    <DialogTitle>Edit list</DialogTitle>
                    <DialogDescription>
                      Type in the new name for your item
                    </DialogDescription>
                  </DialogHeader>
                <form onSubmit={(e) => handleItemEditName(e, item)}>
                  <FieldGroup>
                    <Field>
                      <Input 
                      id="name-1" 
                      name="name" 
                      placeholder="New item name" 
                      required 
                      value={editItemName} 
                      onChange={(e) => setEditItemName(e.target.value)}
                      />
                    </Field>
                  </FieldGroup>
                  <DialogFooter className="mt-5">
                    <DialogClose asChild>
                      <Button  type="submit">Edit item</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
              </Dialog>
              <Separator orientation="vertical"/>
              <Button onClick={() => handleItemEditActive(item)} size="sm" variant={item.active? "outline" : "secondary"}>
                {item.active? "Done" : "Undo"}
              </Button>
            </ItemActions>
          </Item>
      )}
      
      }else{
        return(<div className="w-full flex justify-center"><Spinner/></div>)
      }
    }

  
  function generateUsers(){
    if(list){
      return list.users.map((user : SimpleUser) =>
      <DropdownMenuItem variant={user.id == list.creator.id? "default" : "destructive"} key={user.id}>
        {user.username}
        {user.id !== list.creator.id &&
        <Button variant="ghost">
          <TrashIcon/>
        </Button>
        }
        
      </DropdownMenuItem>)
    }
  }

  async function handleItemCreation(e: React.SubmitEvent<HTMLFormElement>){
    e.preventDefault()
    if(itemName.trim().length < 3){
      toast("item name must be at least 3 characters", {position: "bottom-center"})
      setItemName("")
      return
    }
    try{
      if(list){
        await listCreateItem(list.id, itemName)
        setItemName("")
        loadList()
      }
    }catch(err){
      if(axios.isAxiosError(err)){
        if(err.response?.status === 400){
          toast("item name must be at least 3 characters", {position: "bottom-center"})
        }
      }else{
        toast("something went wrong", {position: "bottom-center"})
      }
    }
  }

  async function handleItemDeletion(itemId: string){
    if(list){
      try{
        await listDeleteItem(list?.id, itemId)
        loadList()
      }catch(err){
        toast("could not delete item", {position: "bottom-center"})
      }
      
    }else{
      toast("error udentifying list", {position: "bottom-center"})
    }
  }

  async function handleItemEditName(e: React.SubmitEvent<HTMLFormElement>, item: ItemDto){
    e.preventDefault()
    if(editItemName.trim().length < 3){
      toast("item name must be at least 3 characters", {position: "top-center"})
      setEditItemName("")
      return
    }
    try{
      if(list){
        await listEditItemName(list.id, item, editItemName)
        setEditItemName("")
        loadList()
      }
    }catch(err){
        if(axios.isAxiosError(err)){
        if(err.response?.status === 400){
          toast("item name must be at least 3 characters", {position: "bottom-center"})
        }
      }else{
        toast("something went wrong", {position: "bottom-center"})
      }
      }
  }

  async function handleItemEditActive(item: ItemDto){
    try{
      if(list){
        await listEditItemActive(list.id, item)
        setEditItemName("")
        loadList()
      }
    }catch(err){
        toast("something went wrong", {position: "bottom-center"})
      }
  }

  return (
    <>

    <div className="w-full h-screen relative p-5">
      
    {loading && <div className="flex justify-center items-center h-full"><Spinner className="size-8"/></div>}
    {!loading &&
      <>
      <div className="mb-8 flex justify-between">
      <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
          <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{list?.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><UserPenIcon/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex justify-between" variant="default">
                  Add user 
                <PlusIcon/>      
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {generateUsers()}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
      <ItemGroup className="h-[calc(100vh-150px)] overflow-y-scroll">
        {generateItems()}
      </ItemGroup>
      <div className="absolute w-[calc(100vw-40px)] max-w-[632px] bottom-5 justify-between">
        <form className="flex" onSubmit={(e) => handleItemCreation(e)}>
          <Input
            className=" w-5/6"
            id="name-1" 
            name="name" 
            placeholder="Eggs"
            required 
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            type="text"
          />
          <Button className=" w-1/6" variant={"outline"} type="submit">Add</Button>
        </form>
      </div>
      
      </>
      }
    </div>
    </>
  )
}

export default ListPage