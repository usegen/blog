import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Trash2, Pencil } from 'lucide-react';

interface Tag {
  id: number;
  name: string;
  icon: string;
}

export function AdminDashboard() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagIcon, setNewTagIcon] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  // Fetch all tags
  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      setTags(data);
    } catch (err) {
      setError('Failed to load tags');
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Create new tag
  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tags-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTagName,
          icon: newTagIcon,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create tag');
      }
      
      setSuccess('Tag created successfully');
      setNewTagName('');
      setNewTagIcon('');
      fetchTags();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tag');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Update tag
  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;

    try {
      const response = await fetch(`/api/tags/${editingTag.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTagName,
          icon: newTagIcon,
        }),
      });

      if (!response.ok) throw new Error('Failed to update tag');
      
      setSuccess('Tag updated successfully');
      setEditingTag(null);
      setNewTagName('');
      setNewTagIcon('');
      fetchTags();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update tag');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Delete tag
  const handleDeleteTag = async (id: number) => {
    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete tag');
      
      setSuccess('Tag deleted successfully');
      fetchTags();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete tag');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Start editing a tag
  const startEditing = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setNewTagIcon(tag.icon);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTag(null);
    setNewTagName('');
    setNewTagIcon('');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Tag Management</h1>
      
      {/* Status Messages */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tags List - Left Side (1/4 width) */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Existing Tags</h2>
            <Button 
              variant="outline" 
              onClick={() => {
                setEditingTag(null);
                setNewTagName('');
                setNewTagIcon('');
              }}
            >
              Create New
            </Button>
          </div>
          <div className="space-y-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <i className={`fas ${tag.icon}`} />
                  <span>{tag.name}</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEditing(tag)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Create/Edit Tag Form - Right Side (3/4 width) */}
        <Card className="p-6 md:col-span-3">
          <h2 className="text-xl font-semibold mb-4">
            {editingTag ? 'Edit Tag' : 'Create New Tag'}
          </h2>
          <form onSubmit={editingTag ? handleUpdateTag : handleCreateTag} className="space-y-4">
            <div>
              <Label htmlFor="tagName">Tag Name</Label>
              <Input
                id="tagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter tag name"
                required
              />
            </div>
            <div>
              <Label htmlFor="tagIcon">Tag Icon (Font Awesome class)</Label>
              <Input
                id="tagIcon"
                value={newTagIcon}
                onChange={(e) => setNewTagIcon(e.target.value)}
                placeholder="e.g., fa-mountain"
                required
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit">
                {editingTag ? 'Update Tag' : 'Create Tag'}
              </Button>
              {editingTag && (
                <Button type="button" variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
} 