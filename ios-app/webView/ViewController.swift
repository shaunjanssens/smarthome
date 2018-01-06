//
//  ViewController.swift
//  webView
//
//  Created by Yash Patel on 18/10/17.
//  Copyright © 2017 Yash Patel. All rights reserved.
//

import UIKit
import WebKit

class ViewController: UIViewController {

    @IBOutlet weak var webview: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let url = URL(string: "https://smarthome-9d4f6.firebaseapp.com/")
        let request = URLRequest(url: url!)
        
        webview.load(request)
        webview.scrollView.bounces = false
    }
    
    override var prefersStatusBarHidden: Bool {
        return true
    }

}

