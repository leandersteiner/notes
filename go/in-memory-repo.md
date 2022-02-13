# In Memory Repo for testing

## Declaration

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

## Usage

```go
var repository = make(post.InMemoryRepository)

func getAllPosts(rw http.ResponseWriter, req *http.Request) {
	allPosts := repository.GetAll()
	result, err := json.Marshal(allPosts)
	if err != nil {
		panic(err)
	}
	rw.Write(result)
}

func getOnePost(rw http.ResponseWriter, req *http.Request) {
	id := chi.URLParam(req, "postId")
	onePost, err := repository.FindById(id)
	if err != nil {
		rw.Write([]byte("Could not find post with id:\n" + id))
	}
	jsonResult, err := json.Marshal(onePost)
	if err != nil {
		panic(err)
	}
	rw.Write([]byte(jsonResult))
}

func createPost(rw http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		fmt.Println(err)
	}
	var newPost post.BlogPost
	err = json.Unmarshal(body, &newPost)
	if err != nil {
		panic(err)
	}
	newId := uuid.New()
	newPost.Id = newId.String()
	repository.Add(newPost)
	rw.Write([]byte("Added Post with id:\n" + newPost.Id))
}

func updatePost(rw http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		panic(err)
	}
	id := chi.URLParam(req, "postId")
	var newPost post.BlogPost
	err = json.Unmarshal(body, &newPost)
	if err != nil {
		panic(err)
	}
	rw.Write([]byte("Update Post with id:\n" + id))
}

func deletePost(rw http.ResponseWriter, req *http.Request) {
	id := chi.URLParam(req, "postId")
	delete(repository, id)
	rw.Write([]byte("Deleted Post with id:\n" + id))
}
```