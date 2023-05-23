import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit, OnDestroy {
  @ViewChild('postsPaginator') postsPaginator!: MatPaginator
  posts: Post[] = []; 
  postsSubs!: Subscription;
  postsCount: number = 0;
  pageSize: number = 2;
  currentPage: number = 1;
  isAuthSub!: Subscription;
  userIsAuthenticated: boolean = false;
  userId: string | null = null;

  constructor(public postsService: PostsService, private authService: AuthService) { }

  deletePost(postId: string) {
    this.postsService.deletePost(postId)
      .subscribe( resp => {
            const updatedPosts = this.posts.filter( post => post.id !== resp.postId)
            this.posts = updatedPosts;
            this.postsCount = updatedPosts.length;
            const skipPrevPage = this.postsCount % this.pageSize;
            if(skipPrevPage === 0 && this.postsPaginator.pageIndex) {
              this.postsPaginator.previousPage()
            }
            

            this.postsService.isLoading = false;
            // this.updatedPosts.next([...this.posts])
            // this.isLoading = false;
          }, error => {
            this.postsService.isLoading = false;
          });
  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.isAuthSub = this.authService.getIsAuthenticatedListener().subscribe( isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    })
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.postsSubs = this.postsService.getPostsUpdatedListener().subscribe((updatedPostsData) => {
      this.posts = updatedPostsData.posts;
      this.postsCount = updatedPostsData.postsCount;
    })

  }

  handlePageEvent(pageData: PageEvent) {
    this.pageSize = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postsService.getPosts(this.pageSize, this.currentPage)
  }

  ngOnDestroy(): void {
    this.postsSubs.unsubscribe();
    this.isAuthSub.unsubscribe();
  }

}
