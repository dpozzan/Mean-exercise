import { Injectable } from "@angular/core";
import { Post } from './post.model';
import { Subject, connect, map } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";


const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class PostsService {
  private post! : FormData;
  private posts: Post[] = [];
  private updatedPosts= new Subject<{posts: Post[], postsCount: number}>();
  private editablePost: Post = { id: '', title: '', content: '', imagePath: '', creator: '' };
  private updatedEditablePost = new Subject<Post>();
  public isLoading: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(pageSize: number, currentPage: number) {
    this.isLoading = true;
    const queryParams = `?pageSize=${pageSize}&page=${currentPage}`;
    this.http.get<{ message: string, postsData: { posts: { _id: string, title: string, content: string, imagePath: string, creator: string }[], postsCount: number } }>(BACKEND_URL + 'posts' + queryParams)
      .pipe(map( responseData => {
        return {
          posts: responseData.postsData.posts.map(post => {
            return { id: post._id, title: post.title, content: post.content, imagePath: post.imagePath, creator: post.creator }
            }),
          postsCount: responseData.postsData.postsCount
        }


      }))
      .subscribe( transformedPostsData => {
        this.posts = transformedPostsData.posts;
        this.updatedPosts.next({posts: [...this.posts], postsCount: transformedPostsData.postsCount})
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      })
    
  }

  getPost(postId: string) {
    this.isLoading = true;
    this.http.get<{ message: string, post: {_id: string, title: string, content: string, imagePath: string, creator: string} }>(BACKEND_URL + 'post/' + postId)
      .pipe(map(response => {
        return {id: response.post._id, title: response.post.title, content: response.post.content, imagePath: response.post.imagePath, creator: response.post.creator}
      }))   
      .subscribe( transformedPost => {
        this.editablePost = transformedPost;
        this.updatedEditablePost.next({...this.editablePost})
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      })
   

  }

  getPostUpdatedListener() {
    return this.updatedEditablePost.asObservable();
  }

  getPostsUpdatedListener() {
    return this.updatedPosts.asObservable();
  }

  createPost(title: string, content: string, image: File | string) {
    this.isLoading = true;
    this.post = new FormData();
    this.post.append('title', title);
    this.post.append('content', content);
    this.post.append('image', image, title)
    // this.post.append('image', post.image, post.title)
    this.http.post<{ message: string, post: { _id: string, title: string, content: string, image: string | File } }>(BACKEND_URL + 'posts', this.post)
      .subscribe( responseData => {
        // I don't really need to refresh here the values, because I already navigate to another page refreshing the site
        // this.posts.push({ id: responseData.post._id, title: responseData.post.title, content: responseData.post.content, imagePath: '' })
        // this.updatedPosts.next([...this.posts])
        this.router.navigate(['/'])
        this.isLoading = false;
      }, error => {
        this.isLoading = false
      })
  }

  deletePost(postId: string) {
    this.isLoading = true;
    return this.http.delete<{ message: string, postId: string }>(BACKEND_URL + 'post/' + postId)
    // Here I don't navigate away, so for not getting an error on next, because I don't have in this file postsCount to update the value of updatedPosts
    // I will return the observable without subscription, and I will manage that outside the service
    // this.http.delete<{ message: string, postId: string }>('http://localhost:3000/api/post/' + postId)
    //   .subscribe( resp => {
    //     const updatedPosts = this.posts.filter( post => post.id !== resp.postId)
    //     this.posts = updatedPosts;
    //     this.updatedPosts.next([...this.posts])
    //     this.isLoading = false;
    //   })
  }

  updatePost(title: string, content: string, image: File | string, postId: string) {
    this.isLoading = true;
    let updatedPost;
    if(typeof(image) === 'object'){
      updatedPost = new FormData();
      updatedPost.append('title', title);
      updatedPost.append('content', content);
      updatedPost.append('image', image, title);

    } else {
      updatedPost = {
        title: title,
        content: content,
        imagePath: image,
      }
    }
    this.http.put<{ message: String, post: { _id: string, title: string, content: string, imagePath: string }}>(BACKEND_URL + 'edit/' + postId, updatedPost)
      .subscribe( resp => {
        // I don't really need to refresh here the values, because I already navigate to another page refreshing the site
        // const updatedPostIndex = this.posts.findIndex( post => post.id === resp.post._id);
        // this.posts[updatedPostIndex] = { id: resp.post._id, title: resp.post.title, content: resp.post.content, imagePath: resp.post.imagePath }
        // this.updatedPosts.next([...this.posts])
        this.router.navigate(['/'])
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      })
  }
}