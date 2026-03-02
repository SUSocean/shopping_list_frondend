import { listGet } from "@/api/listGet"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import type { OpenedList } from "@/types/list.types"

import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardAction
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function ListPage() {
    const path = window.location.pathname.split("/")[2]

    const [list, setList] = useState<OpenedList>()  
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(()=>{
        async function init() {
            console.log(path)
            setLoading(true)
        try{
          const list = await listGet(path)
          setList(list)
          console.log(list)
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
      return list.items.map((list : OpenedList) =>
        <Link to={"/list/" + list.id} key={list.id}>
        <div>
          <Card>
            <CardContent>{list.name}</CardContent>
            <CardAction className="self-end">
              <Button onClick={() => console.log('yes')} variant="ghost">
                done
              </Button>
            </CardAction>
          </Card>
        </div>
        </Link>)
      }
      
    }else{
      return (<div>error</div>)
    }
    }


  return (
    <>
    {loading && <Spinner className="size-8"/>}
    {!loading &&
      <div className="w-full h-screen relative">
        <div className="mb-8 flex justify-between">
          <Button>Back</Button>
        </div>
        {generateItems()}
        <Input
            className="sticky top-0"
            id="name-1" 
            name="name" 
            placeholder="Eggs" 
            required 

        />
    </div>}
    </>
  )
}

export default ListPage