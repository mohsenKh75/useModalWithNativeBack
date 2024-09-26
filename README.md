- Open/close modals by setting/removing a hash from the URL.
- Close the modal by pressing the browser's back button.
- If multiple modals are open, they are closable one by one 
- The hook should be compatible with Next.js 14 and the App Router, using next/navigation instead of next/router.

useage:
- This hook exposes two functions for opening and closing the modal, and a boolean property to check its status.
- The hook accepts a modalId parameter as a string and sets it in the URL.
