// Mock for gsap/SplitText
module.exports = {
  SplitText: jest.fn().mockImplementation(() => ({
    chars: [],
  })),
};
