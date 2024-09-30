import PromptDetail from "@/components/features/prompt-detail";


const EditPage = ({params}: { params: { uuid: string }}) => {
  // get the prompt id from the url on server component
  const {uuid} = params

  return (
    <div className='w-full'>
      <PromptDetail uuid={uuid}/>
    </div>
  )


}

export default EditPage
