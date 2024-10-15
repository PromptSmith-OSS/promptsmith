import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import {SITE_URL} from "@/lib/constants";


// Main component
export default function CodeSnippetTabs({prompt_key}: { prompt_key: string }) {

  // Define the code snippets
  const codeSnippets: {
    [key: string]: string;
  } = {
    curl: `curl -X POST ${SITE_URL}/api/bff/api/sdk/prompt/${prompt_key} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <api_key>"
  `,

    python: `from promtsmithsdk.prompt_smith import PromptSmith
prompt_smith = PromptSmith(${SITE_URL}/api/bff, <api_key>)
prompt = prompt_smith.get_prompt(${prompt_key})
print(prompt)
`,

    javascript: `import PromptSmith from "promptsmith-js-sdk/build/main/lib/sdk";
const client = new PromptSmith(${SITE_URL}/api/bff, <api_key>);
client.getPrompt(${prompt_key}).then((prompt) => {
  console.log(prompt);
}).catch((error) => {
  console.error(error);
});
`
  };

  const {toast} = useToast()

  const handleCopy = (activeTab: string) => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    toast({
      title: "Code copied to clipboard!",
    });
  };

  return (
    <div className="mt-8">
      <Tabs defaultValue={'curl'}
        // onValueChange={setActiveTab}
      >
        <TabsList className="">
          <TabsTrigger value="curl">cURL</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript/TypeScript</TabsTrigger>
        </TabsList>

        <TabsContent value="curl">
          <pre className="p-4 bg-gray-800 text-white rounded">
            <code>{codeSnippets.curl}</code>
          </pre>
          <Button onClick={() => {
            handleCopy('curl')
          }} className="mt-2">
            Copy Code
          </Button>
        </TabsContent>

        <TabsContent value="python">
          <pre className="p-4 bg-gray-800 text-white rounded">
            <code>{codeSnippets.python}</code>
          </pre>
          <Button onClick={() => {
            handleCopy('python')
          }} className="mt-2">
            Copy Code
          </Button>
        </TabsContent>

        <TabsContent value="javascript">
          <pre className="p-4 bg-gray-800 text-white rounded">
            <code>{codeSnippets.javascript}</code>
          </pre>
          <Button onClick={() => {
            handleCopy('javascript')
          }} className="mt-2">
            Copy Code
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
