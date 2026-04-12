import { useEffect, useState } from 'react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '../components/ui'

export function SettingsPage({ settings, onSave }) {
  const [formData, setFormData] = useState(settings)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setFormData(settings)
  }, [settings])

  function updateField(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSave(formData)
    setMessage('Settings saved locally in this browser.')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Configure the GitHub repository and token used for stargazer requests.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <Label htmlFor="owner">Owner</Label>
            <Input id="owner" name="owner" value={formData.owner} onChange={updateField} placeholder="openai" />
          </div>

          <div className="field">
            <Label htmlFor="repo">Repository</Label>
            <Input id="repo" name="repo" value={formData.repo} onChange={updateField} placeholder="openai-node" />
          </div>

          <div className="field">
            <Label htmlFor="token">Token</Label>
            <Input
              id="token"
              name="token"
              type="password"
              value={formData.token}
              onChange={updateField}
              placeholder="github_pat_..."
            />
          </div>

          <div className="actions">
            <Button type="submit">Save settings</Button>
          </div>
        </form>

        {message ? <p className="status-message success">{message}</p> : null}
      </CardContent>
    </Card>
  )
}
