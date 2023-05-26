import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validator, Validators } from "@angular/forms";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { EditablePost } from "../post.model";
import { Subscription } from "rxjs";
import { mimeType } from "./mime-type.validator";

//In this app we use ReactiveFormsModule for creating new post, and FormsModule(Template driven approach) for the login and signup

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  mode: string = 'create';
  editSubs!: Subscription;
  post: EditablePost = { id: '', title: '', content: '', image: '' };
  form!: FormGroup;
  imagePreview: string = '';
  postId: string = '';

  constructor(public postsService: PostsService, private routes: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    })
    this.editSubs = this.postsService.getPostUpdatedListener().subscribe( post => {
      // this.post = { id: post.id, title: post.title, content: post.content, image: post.imagePath };
      this.form.setValue({
        title: post.title,
        content: post.content,
        image: post.imagePath
      })
      this.imagePreview = post.imagePath;
    })

    this.routes.paramMap.subscribe( (paramMap: ParamMap) => {
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId')!;
        this.postsService.getPost(this.postId);
      } else {
        this.mode = 'create';
      }
    })
  }

  // savePost(postForm: NgForm) {
  savePost() {

    if(this.form.invalid){
      return;
    }
    if(this.mode === 'create') {
      const title = this.form.value.title;
      const content = this.form.value.content;
      const image = this.form.value.image
      this.postsService.createPost(title, content, image);

    } else if( this.mode === 'edit'){
      this.postsService.updatePost(this.form.value.title, this.form.value.content, this.form.value.image, this.postId);
    }
    
    this.form.reset();

  }

  onPickFile(event: Event){
    const file = (event.target as HTMLInputElement).files?.[0];
    this.form.patchValue({
      image: file
    })
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = (reader.result) as string;
    }
    reader.readAsDataURL(file!)
    
    
  }
}
