async function getData() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json();
        let body = document.getElementById('table_body');
        body.innerHTML = '';
        for (const post of posts) {
            let style = post.isDeleted ? 'text-decoration: line-through; color: gray;' : '';
            let deleteBtn = post.isDeleted ? '' : `<input type='submit' value='Delete' onclick='Delete(${post.id})'>`;
            body.innerHTML += `<tr style="${style}">
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>${deleteBtn}</td>
            </tr>`
        }
    } catch (error) {
        console.log(error);
    }
}
async function Save() {
    let id = document.getElementById('txt_id').value;
    let title = document.getElementById('txt_title').value;
    let views = document.getElementById('txt_views').value;
    
    if (id) {
        // Edit existing post
        let getItem = await fetch('http://localhost:3000/posts/' + id);
        if (getItem.ok) {
            let res = await fetch('http://localhost:3000/posts/' + id, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    views: views
                })
            })
            if (res.ok) {
                console.log("cap nhat thanh cong");
                getData();
            }
        }
    } else {
        // Create new post with auto-increment ID
        let allPosts = await fetch('http://localhost:3000/posts');
        let posts = await allPosts.json();
        let maxId = 0;
        for (const post of posts) {
            let postId = parseInt(post.id);
            if (postId > maxId) {
                maxId = postId;
            }
        }
        let newId = (maxId + 1).toString();
        
        let res = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: newId,
                title: title,
                views: views,
                isDeleted: false
            })
        })
        if (res.ok) {
            console.log("tao moi thanh cong");
            getData();
        }
    }
}
async function Delete(id) {
    // Soft delete: update isDeleted to true instead of actually deleting
    let getItem = await fetch('http://localhost:3000/posts/' + id);
    if (getItem.ok) {
        let post = await getItem.json();
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...post,
                isDeleted: true
            })
        })
        if (res.ok) {
            console.log("xoa mem thanh cong");
            getData();
        }
    }
}
getData();

