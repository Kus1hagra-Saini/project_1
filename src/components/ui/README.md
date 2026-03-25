# UI Components Library

A collection of reusable, accessible, and beautifully designed React components for the Community Marketplace.

## Components

### Button

A versatile button component with multiple variants and sizes.

```jsx
import { Button } from './components/ui';

<Button variant="primary" size="md">Click me</Button>
<Button variant="secondary" size="lg" isLoading={true}>Loading...</Button>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'`
- `size`: `'sm' | 'md' | 'lg' | 'xl'`
- `isLoading`: `boolean` - Shows loading spinner
- `disabled`: `boolean`

---

### Badge

Small status indicators and labels.

```jsx
import { Badge } from './components/ui';

<Badge variant="success">Free</Badge>
<Badge variant="primary" size="lg">New</Badge>
```

**Props:**
- `variant`: `'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline'`
- `size`: `'sm' | 'md' | 'lg'`

---

### Modal

A flexible modal/dialog component.

```jsx
import { Modal } from './components/ui';

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure?</p>
</Modal>
```

**Props:**
- `isOpen`: `boolean`
- `onClose`: `() => void`
- `title`: `string` (optional)
- `size`: `'sm' | 'md' | 'lg' | 'xl' | 'full'`
- `showCloseButton`: `boolean` (default: true)

---

### Toast / ToastContainer

Notification toasts for user feedback.

```jsx
import { ToastContainer, useToast, showToast } from './components/ui';

// In your component
const { toasts, removeToast } = useToast();

// Show toast programmatically
showToast('Item saved!', 'success');

// Render container
<ToastContainer toasts={toasts} removeToast={removeToast} />
```

**Toast Types:** `'success' | 'error' | 'warning' | 'info'`

---

### Skeleton

Loading placeholders.

```jsx
import { Skeleton, SkeletonCard, SkeletonText } from './components/ui';

<Skeleton width="200px" height="20px" />
<SkeletonCard />
<SkeletonText lines={3} />
```

**Props:**
- `variant`: `'rectangular' | 'circular' | 'text'`
- `width`: `string`
- `height`: `string`

---

### Tooltip

Hover tooltips for additional information.

```jsx
import { Tooltip } from './components/ui';

<Tooltip content="This is helpful info" position="top">
  <button>Hover me</button>
</Tooltip>
```

**Props:**
- `content`: `string`
- `position`: `'top' | 'bottom' | 'left' | 'right'`
- `delay`: `number` (ms, default: 200)

---

### Card

A flexible card container component.

```jsx
import { Card } from './components/ui';

<Card hover padding="md">
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card description</Card.Description>
  </Card.Header>
  <Card.Content>
    Card content here
  </Card.Content>
  <Card.Footer>
    Footer content
  </Card.Footer>
</Card>
```

**Props:**
- `hover`: `boolean` - Adds hover effects
- `padding`: `'none' | 'sm' | 'md' | 'lg'`

---

## Usage Example

```jsx
import { Button, Badge, Modal, ToastContainer, useToast } from './components/ui';

function MyComponent() {
  const [modalOpen, setModalOpen] = useState(false);
  const { toasts, removeToast } = useToast();
  
  return (
    <>
      <Button 
        variant="primary" 
        onClick={() => setModalOpen(true)}
      >
        Open Modal
      </Button>
      
      <Badge variant="success">Active</Badge>
      
      <Modal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Example Modal"
      >
        <p>Modal content</p>
      </Modal>
      
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
```

## Styling

All components use Tailwind CSS and support dark mode automatically. They follow the design system's color palette and spacing conventions.
