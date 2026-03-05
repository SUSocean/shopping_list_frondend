import { listGet } from "@/api/listGet"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import type { OpenedList } from "@/types/list.types"
import type {SimpleUser, UserDto} from "@/types/user.types"
import type { ItemDto } from "@/types/item.types"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import axios from "axios";
import { listDeleteItem } from "@/api/lsitDeleteItem"
import { listEditItemName } from "@/api/listEditItemName"
import { listReorder } from "@/api/listReorder"
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { listCreateItem } from "@/api/listCreateItem"
import {
  TrashIcon,
  PlusIcon,
  PencilIcon,
  UserPenIcon,
  UsersRoundIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CrownIcon,
  ArrowUpDownIcon
} from "lucide-react"

import { Field, FieldGroup } from "@/components/ui/field"
import { listEditItemActive } from "@/api/listEditItemActive"
import { listAddUser } from "@/api/listAddUser"
import { getMe } from "@/api/getMe"


function ListPage() {
    const path = window.location.pathname.split("/")[2]

    const [list, setList] = useState<OpenedList>()  
    const [loading, setLoading] = useState(false)
    const [itemName, setItemName] = useState("")
    const [editItemName, setEditItemName] = useState("")
    const [addUsername, setAddUsername] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState<UserDto>()
    const [swapItem, setSwapItem] = useState<ItemDto>()
    const [isSwapSet, setIsSwapSet] = useState(false)
    const navigate = useNavigate()

    async function loadList(){
        const list = await listGet(path)
          setList(list)
          setIsSwapSet(false)
      }
    async function loadUser(){
        const foundUser = await getMe()
        setUser(foundUser)
      }


    useEffect(()=>{
        async function init() {
          setLoading(true)
          try{
          loadList()
          loadUser()
          setLoading(false)
        } catch(err){
          navigate("/login")
        }
      }
  
      init()
    }, [])

    function generateActiveItems(){
      if(list){
      if(list.items.length < 1){
        return(
          <>
          <p></p>
          <p className="text-muted-foreground text-xl text-center">No items yet</p>
          </>
        )
      }else{
      return list.items.map((item : ItemDto) =>{
        if(item.active){
          return (
              <Item className="mb-1 pt-1 pb-1" variant={item.active? "outline" : "muted"} key={item.id}>
            <ItemContent>
              <ItemTitle>{item.name}</ItemTitle>
            </ItemContent>
            <ItemActions className="h-full">
              <Button onClick={() => handleItemDeletion(item.id)} size="sm" variant="ghost">
                <TrashIcon/>
              </Button>
              <Button 
              variant={(isSwapSet && swapItem?.id === item.id) ? "secondary" : "ghost"}
              onClick={() =>{
                if(isSwapSet && swapItem){
                  if(swapItem.id === item.id){
                    setIsSwapSet(false)
                  }else{
                    handleReorder(swapItem, item)
                  }
                }else{
                  setSwapItem(item)
                  setIsSwapSet(true)
                }
              }} size="sm">
                <ArrowUpDownIcon/>
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
          )
        }
      }
      
          
      )}
      
      }else{
        return(<div className="w-full flex justify-center"><Spinner/></div>)
      }
    }

    function generateInactiveItems(){
      if(list){
      if(list.items.length < 1){
        return(
          <>
          <p></p>
          <p className="text-muted-foreground text-xl text-center">No items yet</p>
          </>
        )
      }else{
      return list.items.map((item : ItemDto) =>{
        if(!item.active){
          return (
              <Item className="mb-1 pt-1 pb-1" variant={item.active? "outline" : "muted"} key={item.id}>
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
          )
        }
      }
      
          
      )}
      
      }else{
        return(<div className="w-full flex justify-center"><Spinner/></div>)
      }
    }
    
    function generateUsers(){
      if(list){
        return list.users.map((_user : SimpleUser) => {
          if(user){
            if(list.creator.id === user.id){
              return (
                  <DropdownMenuItem className="flex justify-between" variant="default" key={_user.id}>
                    {_user.username}
                    {_user.id !== list.creator.id &&
                    <Button variant="ghost">
                      <TrashIcon/>
                    </Button>
                    }
                    
                  </DropdownMenuItem>
              )
            }else{
              return (
                  <DropdownMenuItem className="flex justify-between" variant="default" key={_user.id}>
                    {_user.username}
                    {_user.id === list.creator.id && <CrownIcon/>}
                  </DropdownMenuItem>
              )
            }
          }
        }
        )
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

    async function handleUserAdd(e: React.SubmitEvent<HTMLFormElement>, username: string) {
      e.preventDefault()
      try{
        if(list){
          await listAddUser(list.id, username)
          setAddUsername("")
          loadList()
        }
      }catch(err){
        toast("something went wrong", {position: "top-center"})
      }
    }

    async function handleReorder(firstItem: ItemDto, secondItem: ItemDto){
      try{
        if(list){
          await listReorder(list, firstItem.position, secondItem.position)
          setIsSwapSet(false)
          loadList()
        }
      }catch(err){
        toast("something went wrong", {position: "top-center"})
      }
    }

    return (
      <>

      <div className="w-full h-[100dvh] flex flex-col">
        
      {loading && <div className="flex justify-center items-center h-full"><Spinner className="size-8"/></div>}
      {!loading &&
        <>
        <div className="m-8 flex justify-between">
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
              <Button variant="outline">{list?.creator.id === user?.id? <UserPenIcon/> : <UsersRoundIcon/>}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {list?.creator.id === user?.id &&
                <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex justify-between"variant="ghost">
                      Add user 
                    <PlusIcon/>      
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm">
                  <DialogHeader className="mb-5">
                      <DialogTitle>Add user</DialogTitle>
                      <DialogDescription>
                        Type in the name of a user you want to add to the list
                      </DialogDescription>
                    </DialogHeader>
                  <form onSubmit={(e) => handleUserAdd(e, addUsername)}>
                    <FieldGroup>
                      <Field>
                        <Input 
                        id="name-2" 
                        name="name2" 
                        placeholder="Username" 
                        required 
                        value={addUsername} 
                        onChange={(e) => setAddUsername(e.target.value)}
                        />
                      </Field>
                    </FieldGroup>
                    <DialogFooter className="mt-5">
                      <DialogClose asChild>
                        <Button  type="submit">Add user</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
                </Dialog>
                <DropdownMenuSeparator />
                </>
                }
                {generateUsers()}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ItemGroup className="flex-1 overflow-y-auto p-5 pb-28">
          {generateActiveItems()}
          <Separator className="mt-5"/>
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="flex w-full flex-col gap-2"
          >
            <div className="flex justify-center">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  {isOpen? <ChevronUpIcon /> : <ChevronDownIcon/>}
                  <span className="sr-only">Toggle inactive items</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="flex flex-col gap-2">
            {generateInactiveItems()}
            </CollapsibleContent>
          </Collapsible>
        </ItemGroup>
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-background border-t">
          <div className="max-w-[632px] mx-auto">
            <form className="flex" onSubmit={(e) => handleItemCreation(e)}>
              <Input
                className="w-5/6"
                placeholder="Eggs"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button className="w-1/6" variant="outline" type="submit">
                Add
              </Button>
            </form>
          </div>
        </div>
        
        </>
        }
      </div>
      </>
    )

}

export default ListPage