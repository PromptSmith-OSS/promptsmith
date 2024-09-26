import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";


const RoleSelect = () => {
  return (
    <div className="grid gap-3">
      <Label htmlFor="role">Role</Label>
      <Select defaultValue="system">
        <SelectTrigger>
          <SelectValue placeholder="Select a role"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="assistant">Assistant</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default RoleSelect
