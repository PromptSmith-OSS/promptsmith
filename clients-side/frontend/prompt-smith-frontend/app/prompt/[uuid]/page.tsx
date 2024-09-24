import PromptEdit from "@/components/features/prompt-edit";


const EditPage = ({params}: { params: { uuid: string }}) => {
  // get the prompt id from the url on server component
  const {uuid} = params

  return (
    <div className='w-full'>
      <PromptEdit uuid={uuid}/>
    </div>
  )


}

export default EditPage
