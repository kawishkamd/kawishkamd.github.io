---
title: "About"
date: 2024-08-24T20:00:26+05:30
type: "about"
description: Just a blog :)
---

---

**Redirections**:

- [**Awesome Piracy Resources**](https://kawishkamd.github.io/piracy)
  - Discover a curated list of useful tools and resources.

- **WinUtil Installation**:  
  Run the following PowerShell command to run WinUtil by [Chris Titus](https://github.com/ChrisTitusTech/winutil) :  
  ```bash
  iex "& {$(irm kawishkamd.github.io/win)}"
  ```
- **Chocolatey Installation**:
  Run the following PowerShell command to install Chocolatey:
  ```bash
  iex "& {$(irm kawishkamd.github.io/choco)}"
  ```

---

<!-- HTML -->
{{< rawhtml >}}
<div class="papermod-form-container">
  <form id="papermod-form" class="papermod-form" action="https://formspree.io/f/mzzbbgeo" method="POST">
    <div class="form-group">
      <label for="email">Your email:</label>
      <input type="email" id="email" name="email" required>
    </div>
    <div class="form-group">
      <label for="message">Your message:</label>
      <textarea id="message" name="message" required></textarea>
    </div>
    <button type="submit">Send</button>
    <div id="form-status"></div>
  </form>
</div>

<style>
/* UI-friendly PaperMod-inspired form styles with 20px left padding */
.papermod-form-container {
  max-width: 600px;
  margin: 2rem 0;
  padding: 1rem 1rem 1rem 0px; /* Added 20px left padding here */
}

.papermod-form {
  background-color: var(--entry, #ffffff);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  transition: border-color 0.3s ease;
}

.form-group {
  margin-bottom: 1.5rem;
}

.papermod-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--primary, #333333);
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.5px;
}

.papermod-form input[type="email"],
.papermod-form textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background-color: var(--entry, #ffffff);
  color: var(--primary, #333333);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.papermod-form input[type="email"]:hover,
.papermod-form textarea:hover,
.papermod-form input[type="email"]:focus,
.papermod-form textarea:focus {
  border-color: #573eaa;
  outline: none;
}

.papermod-form textarea {
  min-height: 120px;
  resize: vertical;
}

.papermod-form button[type="submit"] {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #573eaa;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.1s ease;
}

.papermod-form button[type="submit"]:hover {
  background-color: #4a349e;
  transform: translateY(-1px);
}

.papermod-form button[type="submit"]:active {
  transform: translateY(0);
}

#form-status {
  margin-top: 1rem;
  font-weight: bold;
  text-align: center;
}

#form-status.success {
  color: #4caf50;
}

#form-status.error {
  color: #f44336;
}

@media (max-width: 600px) {
  .papermod-form-container {
    padding: 0.5rem 0.5rem 0.5rem 20px; /* Maintained 20px left padding for mobile */
  }
  .papermod-form {
    padding: 1.5rem;
  }
}
</style>

<script>
const form = document.getElementById('papermod-form');
const statusDiv = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusDiv.textContent = 'Sending...';
  statusDiv.className = '';

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      statusDiv.textContent = 'Thank you for your message!';
      statusDiv.className = 'success';
      form.reset();
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    console.error('Error:', error);
    statusDiv.textContent = 'Oops! There was a problem submitting your form. Please try again.';
    statusDiv.className = 'error';
  }
});
</script>
{{< /rawhtml >}}