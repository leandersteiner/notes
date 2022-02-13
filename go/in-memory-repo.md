# In Memory Repo for testing

```go
type InMemoryRepository map[string]BlogPost

func (imr InMemoryRepository) FindById(id string) (BlogPost, error) {
	post := imr[id]
	return post, nil
}

func (imr InMemoryRepository) Add(post BlogPost) {
	imr[post.Id] = post
}

func (imr InMemoryRepository) Delete(postId string) {
	delete(imr, postId)
}

func (imr InMemoryRepository) Update(postId string, newPost BlogPost) {
	newPost.Id = postId
	imr[postId] = newPost
}

func (imr InMemoryRepository) GetAll() []BlogPost {
	var result []BlogPost
	for _, post := range imr {
		result = append(result, post)
	}
	return result
}
```